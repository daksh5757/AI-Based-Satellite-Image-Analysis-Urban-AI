from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
import sqlite3
import json
import traceback
from ai.analyzer import analyze_image
from datetime import datetime

# -----------------------------
# CONFIG
# -----------------------------
UPLOAD_FOLDER = "uploads"
DB_PATH = "urban_ai.db"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


# -----------------------------
# DATABASE HELPERS
# -----------------------------
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS results (
            id TEXT PRIMARY KEY,
            image_name TEXT,
            timestamp TEXT,
            result TEXT
        )
    """)
    conn.commit()
    conn.close()


def save_to_db(filename, result):
    record_id = str(uuid.uuid4())
    conn = get_db()
    conn.execute(
        "INSERT INTO results (id, image_name, timestamp, result) VALUES (?, ?, ?, ?)",
        (record_id, filename, datetime.utcnow().isoformat(), json.dumps(result))
    )
    conn.commit()
    conn.close()
    return record_id


# -----------------------------
# ROUTES
# -----------------------------
@app.route("/")
def home():
    return jsonify({"message": "Urban AI Backend Running"})


@app.route("/analyze", methods=["POST"])
def analyze():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files["image"]
    filename = f"{uuid.uuid4()}_{image.filename}"
    local_path = os.path.join(UPLOAD_FOLDER, filename)
    image.save(local_path)

    try:
        result = analyze_image(local_path)
    except Exception as e:
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500

    record_id = save_to_db(filename, result)

    return jsonify({
        "id": record_id,
        "file": filename,
        "results": result
    })


@app.route("/stats", methods=["GET"])
def stats():
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM results ORDER BY timestamp DESC"
    ).fetchall()
    conn.close()

    if not rows:
        return jsonify({
            "total": 0,
            "avg_score": 0,
            "avg_green": 0,
            "avg_urban": 0,
            "recent": []
        })

    scores, greens, urbans, recent = [], [], [], []

    for row in rows:
        r = json.loads(row["result"])
        scores.append(float(r["sustainability_score"]))
        greens.append(float(r["vegetation_ratio"]))
        urbans.append(float(r["urban_density"]))

        if len(recent) < 3:
            recent.append({
                "name":      row["image_name"],
                "score":     float(r["sustainability_score"]),
                "date":      row["timestamp"],
                "land_use":  r.get("land_use", {}).get("land_use_class", "Unknown")
            })

    return jsonify({
        "total":     len(rows),
        "avg_score": round(sum(scores) / len(scores), 2),
        "avg_green": round(sum(greens) / len(greens), 2),
        "avg_urban": round(sum(urbans) / len(urbans), 2),
        "recent":    recent
    })


# FIX: /history now returns the full parsed `result` object so the
# frontend can reconstruct a complete AIAnalysisResult without any
# JSON.parse gymnastics on the client side.
@app.route("/history", methods=["GET"])
def history():
    conn = get_db()
    rows = conn.execute(
        "SELECT id, image_name, timestamp, result FROM results ORDER BY timestamp DESC"
    ).fetchall()
    conn.close()

    history = []
    for row in rows:
        r = json.loads(row["result"])
        history.append({
            "id":       row["id"],
            "name":     row["image_name"],
            "date":     row["timestamp"],
            "score":    float(r.get("sustainability_score", 0)),
            "land_use": r.get("land_use", {}).get("land_use_class", "Unknown"),
            "metrics":  r.get("metrics", {}),
            # FIX: include the full parsed result so the frontend can pass it
            # directly to AnalysisResults without a second parse step.
            "result":   r
        })

    return jsonify(history)


# -----------------------------
# RUN
# -----------------------------
if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
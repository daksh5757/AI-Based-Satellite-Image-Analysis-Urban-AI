from transformers import pipeline
from PIL import Image

LABELS = [
    "AnnualCrop", "Forest", "HerbaceousVegetation",
    "Highway", "Industrial", "Pasture",
    "PermanentCrop", "Residential", "River", "SeaLake"
]

_classifier = None

def load_model():
    global _classifier
    if _classifier is None:
        print("Loading EuroSAT model (first time only)...")
        _classifier = pipeline(
            "image-classification",
            model="mrm8488/convnext-tiny-finetuned-eurosat",
            top_k=3
        )
        # Fix broken crop_pct in this model's image processor
        _classifier.image_processor.crop_pct = 0.875
        print("Model loaded.")
    return _classifier


def classify_image(image_path: str):
    clf = load_model()
    image = Image.open(image_path).convert("RGB")
    predictions = clf(image)
    top = predictions[0]

    return {
        "land_use_class":  top["label"],
        "confidence":      round(top["score"] * 100, 2),
        "top_predictions": [
            {
                "class":      p["label"],
                "confidence": round(p["score"] * 100, 2)
            }
            for p in predictions
        ]
    }
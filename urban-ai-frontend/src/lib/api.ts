const API_BASE = "http://127.0.0.1:5000";

export async function analyzeImage(file: File) {
  const fd = new FormData();
  fd.append("image", file);

  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchHistory() {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
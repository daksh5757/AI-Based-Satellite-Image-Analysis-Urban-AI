# AI-Based-Satellite-Image-Analysis-Urban-AI
AI-powered satellite image analysis platform for urban development, featuring computer vision, machine learning, and an integrated frontend and backend.

An AI-powered urban analysis platform that uses satellite imagery, computer vision, machine learning, and deep learning to evaluate urban environments and generate actionable sustainability insights.

The system combines a React-based frontend with a Python Flask backend for satellite image processing, land-use classification, environmental analysis, and urban sustainability assessment.

---

## 🌍 Project Overview

Urban development requires continuous monitoring of factors such as vegetation, water bodies, built-up areas, land use, and urban density.

**Urban AI** analyzes satellite images and converts them into meaningful urban and environmental indicators.

The platform can identify:

- 🌳 Vegetation and green-space coverage
- 💧 Water-body coverage
- 🏙️ Urban/building density
- 🛣️ Transportation-related indicators
- 🌱 Vegetation health using NDVI
- 🗺️ Land-use categories
- 🌡️ Heat-island risk
- 🌬️ Estimated air-quality indicators
- ♻️ Sustainability level
- 💡 AI-generated urban planning recommendations

---

## ✨ Key Features

### 🛰️ Satellite Image Analysis
Upload a satellite image and process it through multiple computer vision and AI techniques.

### 🌳 Vegetation Detection
Uses HSV-based image segmentation to estimate vegetation coverage.

### 💧 Water Detection
Identifies water regions using HSV color-space analysis.

### 🏙️ Urban Density Detection
Uses Gaussian blurring, Canny edge detection, and contour analysis to estimate urban density.

### 🌱 NDVI Analysis
Calculates a vegetation index from image channels and classifies vegetation into:

- Dense Vegetation
- Moderate Vegetation
- Sparse Vegetation
- No Vegetation / Urban / Barren

### 🤖 Deep Learning Land-Use Classification
Uses a pretrained **ConvNeXt-Tiny model fine-tuned on the EuroSAT dataset** to classify satellite imagery into land-use categories.

Supported categories include:

- Annual Crop
- Forest
- Herbaceous Vegetation
- Highway
- Industrial
- Pasture
- Permanent Crop
- Residential
- River
- Sea/Lake

### 🔬 K-Means Image Segmentation
Uses unsupervised K-Means clustering to group image pixels into visual regions.

### 🌲 Random Forest Sustainability Classification
Uses vegetation, urban density, water coverage, and NDVI features to classify the area into:

- High
- Medium
- Low
- Critical

sustainability categories.

### 📊 Urban Sustainability Metrics

The system generates metrics including:

- Sustainability Score
- Green Space Percentage
- Building Density
- Water Bodies Percentage
- Transportation Network Score
- Air Quality Estimate
- Heat Island Risk
- Brightness
- Contrast

### 💡 Urban Planning Recommendations

The system generates recommendations based on detected conditions, such as:

- Increasing green spaces
- Managing urban sprawl
- Improving transportation infrastructure
- Improving water-body coverage
- Heat-island mitigation
- Industrial-zone management
- Residential green-corridor planning

---

## 🧠 AI & Computer Vision Pipeline

```text
                Satellite Image
                       │
                       ▼
              Image Preprocessing
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      Vegetation     Water       Urban Density
       Detection    Detection     Detection
          │            │            │
          └────────────┼────────────┘
                       ▼
                  NDVI Analysis
                       │
                       ▼
               K-Means Clustering
                       │
                       ▼
          ConvNeXt-Tiny / EuroSAT
           Land-Use Classification
                       │
                       ▼
              Random Forest
          Sustainability Analysis
                       │
                       ▼
              Derived Metrics
                       │
                       ▼
          Urban Recommendations


🏗️ System Architecture

┌──────────────────────────────────────────────┐
│                 USER                         │
│                                              │
│          Upload Satellite Image              │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│          URBAN AI FRONTEND                   │
│                                              │
│ React + TypeScript + Vite                    │
│ Tailwind CSS                                 │
│ Image Processing / Visualization             │
└──────────────────────┬───────────────────────┘
                       │
                 REST API Request
                       │
                       ▼
┌──────────────────────────────────────────────┐
│          URBAN AI BACKEND                    │
│                                              │
│ Python + Flask                               │
│ OpenCV                                       │
│ NumPy / Scikit-learn                        │
│ Hugging Face Transformers                    │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
              AI / ML Processing
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   Computer Vision   ML Models    Deep Learning
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                Analysis Results
                       │
                       ▼
              Frontend Dashboard


🛠️ Tech Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
TensorFlow.js
Supabase
Lucide React
Backend
Python
Flask
Flask-CORS
OpenCV
NumPy
Scikit-learn
Hugging Face Transformers
Pillow
SQLite
AI / ML
ConvNeXt-Tiny
EuroSAT
Random Forest
K-Means Clustering
NDVI
Computer Vision
Image Segmentation
Canny Edge Detection
HSV Color Segmentation


📂 Project Structure

AI-Based-Satellite-Image-Analysis-Urban-AI/
│
├── urban-ai-backend/
│   │
│   ├── ai/
│   │   ├── analyzer.py
│   │   └── model.py
│   │
│   ├── data/
│   ├── uploads/
│   ├── app.py
│   ├── init_db.py
│   ├── requirements.txt
│   └── test_api.py
│
├── urban-ai-frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── utils/
│   │   ├── types/
│   │   └── main.tsx
│   │
│   ├── supabase/
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md


🔌 Backend API

The Flask backend provides REST API endpoints for communicating with the frontend.

Health Check
GET /

Returns:

{
  "message": "Urban AI Backend Running"
}
Analyze Satellite Image
POST /analyze

Accepts an image file and returns:

Sustainability score
Vegetation ratio
Urban density
Land-use classification
NDVI analysis
Random Forest classification
K-Means clustering
Environmental metrics
AI-generated recommendations
Processed image overlays
Analysis Statistics
GET /stats

Returns aggregated statistics from previously analyzed images.

Analysis History
GET /history

Returns previously processed image analyses and their results.

⚙️ Installation
1. Clone the repository
git clone https://github.com/daksh5757/AI-Based-Satellite-Image-Analysis-Urban-AI.git

cd AI-Based-Satellite-Image-Analysis-Urban-AI
🔹 Backend Setup

Navigate to the backend:

cd urban-ai-backend

Create a virtual environment:

python -m venv venv

Activate it on Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Run the backend:

python app.py

The backend runs on:

http://127.0.0.1:5000
🔹 Frontend Setup

Open a new terminal and navigate to:

cd urban-ai-frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will then be available through the Vite development server.

🔄 Application Workflow
1. User uploads satellite image
              ↓
2. Frontend sends image to backend
              ↓
3. Backend preprocesses image
              ↓
4. Computer vision analysis
              ↓
5. NDVI calculation
              ↓
6. K-Means segmentation
              ↓
7. ConvNeXt land-use classification
              ↓
8. Random Forest sustainability classification
              ↓
9. Environmental metrics calculated
              ↓
10. Urban planning recommendations generated
              ↓
11. Results returned to frontend
              ↓
12. Results displayed through dashboard
📊 Example Analysis Output

The system can produce results such as:

Land Use:
Residential

Vegetation:
32.4%

Urban Density:
48.7%

Water Bodies:
4.2%

NDVI:
0.21
Moderate Vegetation

Sustainability:
Medium

Heat Island Risk:
Medium

Air Quality Estimate:
...

Recommendations:
- Increase green space
- Improve transportation connectivity
- Implement heat-island mitigation
🎯 Project Objectives
Develop an AI-based system for satellite image analysis.
Detect important urban and environmental features.
Apply computer vision techniques to satellite imagery.
Integrate machine learning and deep learning models.
Generate urban sustainability indicators.
Provide actionable recommendations for urban planning.
Build an interactive frontend connected to an AI backend.
🚀 Future Scope
Integration with real-time satellite imagery
Google Earth Engine integration
Multi-temporal satellite image comparison
Urban growth and change detection
GIS-based visualization
Higher-resolution satellite imagery
Improved model training with larger datasets
Cloud deployment
Real-time urban monitoring
Integration with municipal planning systems
🔐 Security & Configuration

Sensitive configuration files such as .env are excluded from version control.

Generated files such as:

node_modules
dist
local databases
uploads
environment files

are excluded using .gitignore.

📌 Project Status

Status: Functional Prototype

The project currently provides an end-to-end workflow for satellite image upload, AI/ML analysis, result generation, and visualization.

👨‍💻 Project

Urban AI – AI-Based Satellite Image Analysis

Domain:
Artificial Intelligence • Machine Learning • Computer Vision • Remote Sensing • Urban Analytics

⭐ Highlights

This project demonstrates the integration of:

Computer Vision + Machine Learning + Deep Learning + Web Development

into a single platform for intelligent urban and environmental analysis.


### One thing I noticed while inspecting the code

Your backend's actual pipeline is particularly strong for a college/portfolio project: **OpenCV → NDVI → K-Means → ConvNeXt/EuroSAT → Random Forest → sustainability metrics → recommendations**. :contentReference[oaicite:3]{index=3}

So I would **not** use the earlier generic README I gave you. Use the version above.

### Next step

Don't edit GitHub manually yet. Since we already have your local Git repo connected, edit the **local `README.md`**, save it, and then we'll run:

```cmd
git add README.md
git commit -m "Update project documentation"
git push

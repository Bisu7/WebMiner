# 🌐 WebMiner: AI-Powered Adaptive Web Scraper

![WebMiner Banner](https://img.shields.io/badge/WebMiner-AI--Powered-blueviolet?style=for-the-badge&logo=probot)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)

**WebMiner** is a sophisticated, intelligent web scraping platform that leverages Machine Learning to adapt to different website structures. Unlike traditional scrapers that rely on brittle, hard-coded CSS selectors, WebMiner analyzes the DOM structure and identifies patterns to extract relevant data (like products, prices, and metrics) even from unfamiliar sites.

---

## ✨ Key Features

-   **🧠 ML-Guided Extraction**: Uses a Scikit-Learn model to intelligently identify product containers, names, and prices.
-   **🔄 Adaptive Fallback**: Automatically switches to a robust traditional scraper if the ML model is still training.
-   **📊 Dynamic Visualizations**:
    -   **Word Frequency**: Analyzes and visualizes the most common terms on any page.
    -   **Link Analysis**: Breaks down internal vs. external links.
    -   **Price History**: Simulates and tracks price changes over time for extracted products.
    -   **Visitor Metrics**: Visualizes page popularity trends.
-   **📈 Self-Improving**: Automatically collects training data from new sites to improve the extraction model over time.
-   **💎 Premium UI**: A modern, responsive React dashboard with 3D elements powered by Three.js.

---

## 🧠 Machine Learning & Extraction Logic

WebMiner's core intelligence lies in its ability to understand web page structure through machine learning.

### The Model
-   **Algorithm**: Random Forest Classifier.
-   **Objective**: To distinguish between standard layout elements and actual **Product Containers**.
-   **Feature Engineering**:
    -   **DOM Metadata**: Tag depth, child count, sibling count, and text length.
    -   **Semantic Signals**: Detection of currency symbols, prices, and e-commerce keywords.
    -   **Structural TF-IDF**: The HTML snippet of each candidate tag is vectorized using TF-IDF to capture architectural patterns.
    -   **Contextual Encoding**: One-hot encoding of tag types (`div`, `article`, etc.) and domain categories.

### How It Works
1.  **Candidate Selection**: The system identifies all potential container tags in the DOM.
2.  **Inference**: Each candidate is processed through the model to predict the probability of it being a product item.
3.  **Pattern Discovery**: Once containers are identified, WebMiner analyzes internal clusters to find consistent selectors for prices, titles, and images.
4.  **Rule Generation**: It dynamically generates CSS and XPath selectors, creating a "fingerprint" for that specific website structure.

---

## 🏗️ Architecture

WebMiner is built with a decoupled architecture for scalability:

-   **Backend**: A Python Flask server handling the core logic, HTML parsing, and ML inference.
-   **Frontend**: A React application featuring high-performance data visualizations and a 3D-enhanced user interface.
-   **Model**: Scikit-Learn based classification models for identifying web elements.

---

## 🛠️ Tech Stack

### Backend
-   **Core**: [Flask](https://flask.palletsprojects.com/)
-   **Parsing**: [BeautifulSoup4](https://www.crummy.com/software/BeautifulSoup/), [lxml](https://lxml.de/)
-   **Data Science**: [NumPy](https://numpy.org/), [Pandas](https://pandas.pydata.org/), [Scikit-Learn](https://scikit-learn.org/)
-   **Utilities**: [Joblib](https://joblib.readthedocs.io/), [Requests](https://requests.readthedocs.io/)

### Frontend
-   **Framework**: [React 19](https://react.dev/)
-   **3D Graphics**: [Three.js](https://threejs.org/) via [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Styled Components](https://styled-components.com/)
-   **Routing**: [React Router 7](https://reactrouter.com/)

---

## 🚀 Getting Started

Follow these steps to get your local development environment up and running.

### Prerequisites
-   **Python 3.9+**
-   **Node.js 18+**
-   **npm** (comes with Node.js)

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```
*The backend will run on `http://localhost:5000`*

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```
*The frontend will open at `http://localhost:3000`*

---

## 📖 Usage

1.  Launch both the Backend and Frontend servers.
2.  Open your browser to `http://localhost:3000`.
3.  Enter a URL (e.g., an e-commerce product page) into the search bar.
4.  WebMiner will analyze the site and present a detailed dashboard with extracted products, word clouds, and structural metrics.

---

## 📂 Project Structure

```text
WebMiner/
├── backend/            # Python Flask server
│   ├── app.py          # Main API entry point
│   ├── requirements.txt# Backend dependencies
│   └── training_data/  # Collected HTML for model training
├── frontend/           # React Application
│   ├── src/            # Components, Hooks, and Pages
│   └── public/         # Static assets
├── Model/              # Serialized ML models (.pkl files)
├── Diagrams/           # Architecture and Design diagrams
└── package.json        # Root-level configuration
```

---

## 🎨 Design Documentation
The `Diagrams/` folder contains comprehensive UML and design documentation for the project, including:
-   **Component Diagrams**
-   **Sequence Diagrams**
-   **ER Diagrams**
-   **Activity Diagrams**
-   **Deployment Diagrams**

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---


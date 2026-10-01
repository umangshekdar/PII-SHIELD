# 🛡️ PII Shield

**"Scan Before You Share."**

PII Shield is a full-stack web application that detects and selectively redacts Personally Identifiable Information (PII) from documents before they are shared.

---

## ✨ Features

- **Real file upload** — Upload PDF, DOCX, XLSX, CSV, TXT, JPG, PNG (up to 10 MB)
- **Intelligent PII detection** — Regex + NLP hybrid engine detects Aadhaar, PAN, Passport, Bank Account, IFSC, and more
- **Selective redaction** — Only high-risk PII is redacted by default; Name, Email, Phone remain visible
- **Risk assessment** — Privacy risk score with LOW / MEDIUM / HIGH / CRITICAL levels
- **Real document output** — Generates actual redacted PDF, DOCX, XLSX, CSV files for download
- **Privacy-first** — Documents are processed temporarily and never permanently stored
- **Demo mode** — Built-in demo with sample KYC document

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS v4, Framer Motion |
| Backend | Python, FastAPI |
| Detection | spaCy NLP, custom Regex, context-aware rules |
| Document Processing | PyMuPDF, python-docx, openpyxl |
| OCR | Tesseract (with graceful fallback) |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+) and npm
- **Python** (3.10+)
- (Optional) **Tesseract OCR** for image/scanned PDF processing

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Start the server
python run.py
```

Backend runs at: **http://localhost:8000**

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 📁 Project Structure

```
pii-shield/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API client
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # React context (state)
│   │   └── utils/           # Helpers
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── detectors/       # PII detection engine
│   │   ├── processors/      # Document text extraction
│   │   ├── redaction/       # Document redaction
│   │   ├── models/          # Pydantic schemas
│   │   └── utils/           # Helpers, risk scorer
│   ├── requirements.txt
│   └── run.py
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/scan` | Upload & scan a document |
| POST | `/api/redact` | Redact selected PII items |
| GET | `/api/download/{scan_id}` | Download redacted file |
| POST | `/api/demo` | Run demo document scan |
| GET | `/api/health` | Health check |

---

## 🧪 Acceptance Test

The demo document produces:

| Field | Detected | Default Action |
|-------|----------|---------------|
| Name: Rahul Sharma | ✅ | KEEP |
| Email: rahul.sharma@example.com | ✅ | KEEP |
| Phone: 9876543210 | ✅ | KEEP |
| Address: 42 Lake Road, Bhopal | ✅ | REDACT |
| Aadhaar: 4521 7834 9126 | ✅ | REDACT |
| PAN: ABCDE1234F | ✅ | REDACT |
| Passport: P1234567 | ✅ | REDACT |
| Bank Account: 123456789012 | ✅ | REDACT |
| IFSC: SBIN0001234 | ✅ | REDACT |

---

## ⚠️ Disclaimer

PII Shield is a prototype project. It does not claim 100% detection accuracy or legal compliance. The risk score is an application-level indicator, not an official classification.

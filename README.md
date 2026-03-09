# PDF Extraction & OCR Portal

A production-ready full-stack application designed to parse, translate, and manage land registration (Encumbrance Certificate) data from both digital and scanned PDFs.

## 🚀 Quick Start for Newly Cloned Versions

### 1. System Dependencies
The OCR pipeline requires image processing and PDF rendering tools.

**On macOS (Homebrew):**
```bash
brew install graphicsmagick ghostscript
```

**On Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y graphicsmagick ghostscript
```

**On Windows:**
*   **Chocolatey:** `choco install graphicsmagick ghostscript`
*   **Winget:** `winget install GraphicsMagick.GraphicsMagick ArtifexSoftware.Ghostscript`
*   **Manual:** Download binaries from the [GraphicsMagick](http://www.graphicsmagick.org/download.html) and [Ghostscript](https://ghostscript.com/releases/gsdnld.html) websites. Ensure they are added to your System PATH.

### 2. Environment Variables

**Backend (`backend/.env`)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/pdf_extraction
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

**Frontend (`frontend/.env.local`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_DEMO_EMAIL=admin@test.com
NEXT_PUBLIC_DEMO_PASSWORD=123456
```

### 3. Application Setup

#### **Terminal 1: Database & Backend**
```bash
cd backend
npm install
npx drizzle-kit push  # Synchronizes the schema with your local Postgres
npm run start:dev     # Starts NestJS server on port 4000
```

#### **Terminal 2: Frontend Dashboard**
```bash
cd frontend
npm install
npm run dev           # Starts Next.js on port 3000
```

---

## 🛠 Technical Architecture

### **Extraction Engine (Dual-Layer Strategy)**
1.  **Direct Text Layer**: First, the system attempts to extract Unicode Tamil/English text directly from the PDF stream for maximum accuracy and speed.
2.  **OCR Fallback**: If the PDF is scanned or uses non-standard encoding (like Bamini), the system automatically triggers an OCR pipeline:
    *   **Ghostscript**: Renders PDF pages into high-DPI images.
    *   **Sharp**: Preprocesses images (grayscale, normalization) to improve legibility.
    *   **Tesseract.js**: Performs optical character recognition on both Tamil and English scripts.

### **Data Processing**
*   **Regex Intelligence**: Custom-tuned patterns extract Survey Numbers, Document IDs, Village names, and Party information.
*   **Translation Layer**: Integrates with a translation service to provide English equivalents for all extracted Tamil fields.
*   **Persistence**: Uses **PostgreSQL** with **Drizzle ORM** for type-safe database queries.

### **User Interface**
*   **Split-View Previewer**: Compare the original PDF directly against the extracted English or Tamil text side-by-side.
*   **Real-time Dashboard**: Filter and search through extracted records with a premium, responsive UI built with Tailwind CSS.

## 📋 Assumptions & Constraints
*   **OCR Quality**: Accuracy depends on the resolution of the scanned document.
*   **Formatting**: Regex is optimized for standard Tamil Nadu Registration Department layouts.
*   **Database**: Assumes a standard PostgreSQL instance is running.

## 📄 Documentation
*   [Database Schema Details](docs/database-schema.md)

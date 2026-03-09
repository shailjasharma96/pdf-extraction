Tamil EC PDF Parser

This project parses Tamil Encumbrance Certificate (EC) PDFs, extracts transaction information, translates relevant fields into English, and stores the results in a searchable database.

 Quick Start

1. Prerequisites
    Node.js (v18+)
    PostgreSQL running locally

2. Environment Variables
    Add a '.env' in 'backend/':
    ```env
    DATABASE_URL=postgres://localhost:5432/pdf_extraction
    PORT=4000
    ```

    Add a '.env.local' in 'frontend/':
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:4000
    ```

3. Setup
    ```bash
    # Terminal 1 - Backend
    cd backend
    npm install
    npx drizzle-kit push  # Sync the schema
    npm run start:dev

    # Terminal 2 - Frontend
    cd frontend
    npm install
    npm run dev
    ```

    App runs at:  [http://localhost:3000](http://localhost:3000)
    Login: `admin@test.com` / `123456`

    ---

 Technical Overview

1. Architecture
    Frontend: Next.js 15 (App Router) with Tailwind CSS  
    Backend: NestJS (TypeScript)  
    Database: PostgreSQL using Drizzle ORM

2. Database Schema
    I used Drizzle to manage the schema. For details check 'docs/database-schema.md'
    
3. API Endpoint
    Upload EC PDF
    POST /transactions/upload

    Request:
    multipart/form-data
    pdf: file


4. Known Constraints / Assumptions
    Format: The regex patterns are tuned for standard Tamil EC layouts. If the layout changes significantly, the parser might need adjustments.
    Selected Text: The parser relies on standard PDF text extraction. It doesn't include OCR, so it won't work on scanned images/photos.
    Translation: Names and specific regional terms are translated automatically. It's accurate for general use but might need verification for legal filings.
    Auth: Authentication is a simple demo login used only for accessing the UI.


5. Future Improvements
    Add OCR support for scanned EC documents
    Improve field detection for different EC formats
    Add pagination for large transaction sets
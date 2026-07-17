# DocuCraft Studio Pro

An intelligent, browser-accessible document formatting and layout engineering suite built on **Antigravity IDE** and powered by **Google Cloud** and **Gemini APIs**.

## 🚀 Live Links
* **Live Deployment URL:** `https://docucraft-studio-pro.web.app/`
* **Development Platform:** Developed using **Antigravity IDE** 

## 🛠️ Tech Stack & Google Technologies
* **Development Workspace:** Project IDX (Mandatory Environment Workflow)
* **Frontend Architecture:** React, TypeScript, Next.js (App Router), Tailwind CSS v4
* **AI Engine:** Google AI Studio & Gemini API (`gemini-1.5-flash`) for structural text enrichment and automatic summarization
* **Security Framework:** Firebase App Check (reCAPTCHA v3) protecting backend routes from automation abuse[cite: 1]
* **Deployment Infrastructure:** Google Cloud Run / Firebase App Hosting serverless pipeline[cite: 1]
* **Document Engines:** Client-side zero-cost asset rendering (`jspdf`, `html2canvas`, `docx`)

## ✨ Key Features Implemented
1. **Dynamic Workspace Preview Engine:** Real-time dual-pane editor that maps changes instantly to an interactive document preview box
2. **Three Standardized Enterprise Templates:**
   * **Professional Resume:** Dynamic index-slicing logic that structures candidate contact lines, prevents repeating rows, and maps section elements.
   * **Formal Business Letter:** Elegant, formal serif-based executive layout with specific `SUBJECT:` block bolding and text-justify alignments.
   * **Academic/Project Report:** Corporate publication layout featuring auto-bolding numbered headers and structured technical lists.
3. **Strict A4 Bounding Controls:** Hard-coded $1$-inch margins applied uniformly on all boundaries of the canvas for direct printable parity.
4. **Theme Customization:** Toggles fluidly between an high-contrast dark space and a customized warm cream aesthetic (`#f4efe8`, `#d7c7b9`, `#826554`, `#2b211c`).
5. **AI Integration:** Direct connection to Gemini API handling automated professional polishing and text summaries[cite: 1].

## 📦 Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Expelliarmus3/DocuCraft.git](https://github.com/Expelliarmus3/DocuCraft.git)
   cd DocuCraft```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN= 
   NEXT_PUBLIC_FIREBASE_PROJECT_ID= 
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET= 
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID= 
   NEXT_PUBLIC_FIREBASE_APP_ID= 
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_key
   NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN=true
    ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```  
   

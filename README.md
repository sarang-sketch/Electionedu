# 🗳️ Election Process Education Assistant

An interactive, gamified, and AI-powered web application that simplifies the democratic election process through engaging visuals, interactive quizzes, and dynamic multilingual support.

---

## 1. Your Chosen Vertical

**Vertical:** Election Process Education & Smart Civic Assistant

This project focuses on **civic education** by transforming complex electoral processes into an interactive, gamified learning experience. Many citizens lack a comprehensive understanding of democratic processes, and traditional educational materials are often text-heavy, static, and restricted by language barriers. By creating a smart, dynamic assistant capable of logical decision making based on user context, this application solves the civic awareness gap.

---

## 2. Approach and Logic

Our approach is designed to provide practical and real-world usability while maintaining strict adherence to enterprise-grade software standards. The logic is built on the following pillars:

- **Gamified Micro-Learning:** Information is broken down into digestible, interactive modules (Journey Map, Timeline, Glossary, Quiz) with instant visual feedback.
- **Smart, Dynamic Assistant:** The AI Chat Assistant uses context-aware logic to provide real-time, neutral, and factual answers to any election-related query.
- **Dynamic Multilingualism:** To ensure inclusivity, the entire platform dynamically translates its content (UI, quizzes, and chat) into 7 regional languages (English, Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati) based on user preference.
- **Inclusive & Accessible Design (Accessibility):** The platform is WCAG compliant, utilizing semantic HTML, proper ARIA labels (`aria-expanded`, `aria-label`), and full keyboard navigation support, ensuring usability for all citizens.
- **Optimal Use of Resources (Efficiency):** We implemented `React.lazy()` and `<Suspense>` for code-splitting the frontend, and `compression` middleware on the backend to GZIP HTTP responses. This guarantees minimal network payloads and lightning-fast load times.

---

## 3. How the Solution Works

The application operates on a secure, robust, and clean MERN-stack inspired architecture, utilizing extensive Google Services for power and scale.

### Architecture & Data Flow
1. **Frontend (React + Vite):** Renders the premium glassmorphism UI. It handles state management locally for maximum performance.
2. **Backend (Express.js):** Acts as a secure proxy layer. All frontend requests pass through strict security middleware before reaching external APIs.
3. **AI Engine:** The Express backend communicates directly with the Google Gemini API to generate contextual chat responses and real-time UI translations.

### Meaningful Integration of Google Services
This project heavily leverages the Google ecosystem:
- **Google Gemini AI (`gemini-2.5-flash`):** Drives the core intelligence of the Smart Assistant and powers the real-time translation engine.
- **Firebase Analytics & Performance Monitoring:** Tracks user engagement, language preferences, and page load metrics to ensure real-world usability.
- **Firebase Hosting:** The frontend is configured for deployment on Firebase's global CDN via `firebase.json` and `.firebaserc`, implementing Strict Content-Security-Policies.
- **Google App Engine:** `app.yaml` files are configured for both frontend and backend to enable auto-scaling cloud deployment.
- **Google Cloud Logging:** The backend implements a custom JSON logger structured specifically for Stackdriver/Google Cloud Operations.
- **Google Charts API:** Renders the interactive Timeline component.

### Safe and Responsible Implementation (Security)
- **Helmet:** Secures HTTP headers against vulnerabilities.
- **Express Rate Limiting:** Dedicated strict limiters (e.g., 15 requests/15 mins for the AI endpoint) prevent DDoS abuse.
- **Input Sanitization:** Uses `DOMPurify` on the frontend to prevent Cross-Site Scripting (XSS) from AI-generated markdown, and `express-mongo-sanitize` / `hpp` on the backend to block injection attacks and HTTP Parameter Pollution.
- **CORS Protection:** Enforces strict cross-origin resource sharing policies.

### Validation of Functionality (Testing)
- **Frontend (Vitest):** A comprehensive suite of component tests validates UI rendering and interactions, providing robust code coverage.
- **Backend (Jest & Supertest):** Integration tests rigorously validate the Express API endpoints, ensuring correct status codes and error handling schemas.
- **Error Boundaries:** React `ErrorBoundary` gracefully catches runtime crashes, preventing white-screen failures in production.

---

## 4. Any Assumptions Made

To ensure a focused and functional prototype, the following assumptions were made:
1. **API Availability:** It is assumed the user has a valid Google Gemini API key configured in their environment variables.
2. **Internet Connectivity:** As a cloud-reliant application (Gemini AI, Google Fonts, Firebase), an active internet connection is assumed to be available.
3. **Neutrality Constraints:** The AI Assistant is hard-prompted to remain strictly neutral and non-partisan. It is assumed the underlying Gemini model accurately adheres to these system instructions.
4. **Data Staticity:** While the chat and translations are dynamic, the core quiz questions and glossary terms are currently assumed to be curated and static, though the architecture easily supports dynamic database integration in the future.
5. **Modern Browser:** It is assumed the user is accessing the platform via a modern web browser capable of supporting React 18, CSS Grid, and dynamic imports.

---

## 🚀 Setup & Local Execution

**1. Backend Setup**
```bash
cd backend
npm install
# Create a .env file and add: GEMINI_API_KEY=your_key_here
npm run start
```
*Runs on http://localhost:5000*

**2. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```
*Runs on http://localhost:5173*

**3. Running Tests**
- **Frontend:** `cd frontend && npm run test`
- **Backend:** `cd backend && npm run test`

---

## 👨‍💻 Authorship
Designed and developed by **sarang-sketch** (beanschoco93@gmail.com). Maintained exclusively within a single GitHub branch as per hackathon requirements.

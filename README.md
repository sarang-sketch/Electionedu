# Election Process Education Assistant

An interactive, gamified, and AI-powered web application designed to help users understand the election process, timelines, and steps in an easy-to-follow and engaging way.

## 1. Chosen Vertical
**Election Process Education**
This project focuses on civic education by simplifying the complex electoral process into an interactive, visually stunning, and gamified experience that encourages learning and participation.

## 2. Approach and Logic
The application was built with the following core logic and design approach:
- **Gamified Learning**: Instead of a static textbook approach, the UI uses a premium "Cyber/Neon" glassmorphism theme, dynamic animations, and interactive components (like expanding Journey Maps and responsive Quizzes) to maintain user engagement.
- **Micro-Learning**: Information is broken down into digestible pieces across different tabs: a step-by-step Journey Map, a visual Timeline, a searchable Glossary, and a self-assessment Quiz.
- **AI-Powered Assistance**: A Smart Q&A Assistant is pinned to the dashboard, allowing users to ask contextual questions at any time during their learning journey.
- **Secure Architecture**: The frontend handles the interactive UI, while a lightweight Express.js backend securely proxies requests to the Google Gemini API, ensuring API keys are never exposed to the client.

## 3. How the Solution Works
- **Interactive Election Journey Map**: A step-by-step visual timeline of the election process with expanding details explaining registration, campaigning, voting, counting, and inauguration.
- **Smart Q&A Assistant**: An intelligent chatbot powered by the **Google Gemini API (`gemini-2.5-flash`)**. The React frontend sends the user's question to the Node.js backend (`/api/chat`), which constructs a specific context prompt instructing the AI to act neutrally and factually as an Election Education Assistant. The response is then streamed back to the user interface.
- **Election Glossary**: A client-side searchable database of key election terms (Ballot, EVM, Constituency, etc.).
- **Knowledge Check (Quiz)**: An interactive quiz component that tests user understanding and provides immediate visual feedback (glowing green/red) and detailed explanations.
- **Timeline View**: Visual representation of key election dates utilizing `react-google-charts`.

## 4. Assumptions Made
- The core target audience understands basic digital navigation but lacks in-depth knowledge of electoral mechanics.
- The app assumes the user is asking questions generally applicable to democratic elections. The backend system prompt enforces this boundary.
- The timeline data uses placeholder dates for a fictional election cycle. In a production environment, this data would be fetched dynamically from an official election commission API or database.
- The user has an active internet connection to communicate with the Google Gemini API.

## Tech Stack & Google Services
- **Frontend**: React (Vite), CSS Modules, `lucide-react`.
- **Backend**: Node.js, Express.js.
- **Google Services Integrated**: 
  - **Google Generative AI SDK (Gemini API)**: Powers the conversational AI assistant.
  - **Google Charts (`react-google-charts`)**: Powers the interactive Timeline visualization.
  - **Google Fonts (Outfit & Inter)**: Provides the premium modern typography.

---

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Set up your environment variables by creating a `.env` file:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_actual_api_key_here
   ```
4. Start the backend server: `node server.js`

### 2. Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open the displayed URL (`http://localhost:5173`) in your browser.

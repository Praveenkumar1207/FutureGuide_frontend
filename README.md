Future Guide - Frontend
Future Guide is an AI-powered personalized career guidance platform designed to help students and professionals navigate their career paths. The application provides tools for resume analysis, job compatibility checking, and automated roadmap generation based on specific career goals.

🚀 Features
AI Resume Analyzer: Upload your resume to get a comprehensive score based on grammar, content, clarity, and impact. It provides actionable suggestions and identifies strong action verbs and accomplishments.

Job Fit Analyzer: Compare your resume and LinkedIn profile against specific job descriptions to get a percentage match across technical skills, experience, and domain fit.

AI Roadmap Generator: Create custom learning paths for technologies like React Native, Full Stack Development, System Design, and Generative AI.

Interactive ChatBot: An AI assistant to help with job search queries, career advice, and education guidance.

Mock Interviews: Technical and behavioral interview preparation with AI-generated questions and real-time performance feedback.

Trend Tracking: Stay updated with trending technologies like Flutter, Next.js, and Node.js.

🛠️ Tech Stack
Framework: React Native / Expo

Styling: CSS-in-JS / Styled Components

State Management: React Hooks (Context API/Redux)

Navigation: React Navigation

Networking: Axios / Fetch API

AI Integration: OpenAI / Gemini API (via backend)

Documents: PDF Parsing and processing support

📂 Project Structure
Plaintext
FutureGuide_frontend/
├── assets/             # Images, fonts, and local static files
├── components/         # Reusable UI components (Buttons, Inputs, Cards)
├── navigation/         # Navigation configuration and stack definitions
├── screens/            # Application screens
│   ├── Auth/           # Login and Signup screens
│   ├── Analysis/       # Resume and Job Fit analyzer screens
│   ├── Roadmap/        # Learning path and roadmap screens
│   ├── Interview/      # Mock interview and Q/A prep screens
│   └── Profile/        # User profile and settings management
├── services/           # API call logic and third-party integrations
├── utils/              # Helper functions and constants
└── App.js              # Entry point of the application
🏁 Getting Started
Prerequisites

Node.js (v16 or higher)

Expo CLI (npm install -g expo-cli)

iOS Simulator or Android Emulator

Installation

Clone the repository:

Bash
git clone https://github.com/Praveenkumar1207/FutureGuide_frontend.git
cd FutureGuide_frontend
Install dependencies:

Bash
npm install
Set up Environment Variables: Create a .env file in the root directory and add your backend API URL:

Code snippet
REACT_APP_API_URL=https://your-backend-api.com
Run the application:

Bash
npx expo start
📸 Screen Previews
Login Screen	Dashboard	Roadmap Generator
🤝 Contributing
Contributions are welcome! If you'd like to improve Future Guide, please follow these steps:

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

Developed by Praveen Kumar

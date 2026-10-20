# THM Copilot

THM Copilot is an intelligent assistant designed to act as an educational pentesting mentor. It helps users analyze evidence, explain what terminal outputs mean, and suggests the next most promising steps while completing TryHackMe labs.

## Features

- **Session Management:** Start new investigations with a clear room objective.
- **Evidence Analysis:** Paste terminal output (like Nmap scans, enum scripts, etc.) and receive context-aware mentoring.
- **Hypothesis & Evidence Tracking:** Maintains the state of confirmed evidence and active hypotheses.
- **Code Highlighting & Copying:** Easily copy suggested commands from the assistant.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Zustand (for state management).
- **Backend:** Express proxy server (to securely communicate with the OpenAI or Gemini API).

## Prerequisites

- Node.js (v18+ recommended)
- An OpenAI or Gemini API Key

## Installation & Setup

1. **Install Dependencies**
   Navigate to the root directory and install all required packages:
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Configuration**
   Create a \`.env\` file in the root directory by copying the example:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Configure the provider and add your API key in \`.env\`:
   \`\`\`env
   # Choose 'openai' or 'gemini'
   AI_PROVIDER=openai
   OPENAI_API_KEY=your_openai_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   # MODEL_NAME=gpt-4o
   PORT=3001
   \`\`\`
   *Note: Using these APIs may incur separate costs billed by the respective providers. Please monitor your API usage.*

3. **Running the Application**
   Start both the Vite frontend and the Express backend concurrently:
   \`\`\`bash
   npm run dev
   \`\`\`
   The frontend will be available at \`http://localhost:5173\` and the backend at \`http://localhost:3001\`.

## Project Structure

- \`server/index.js\`: The Express backend that securely relays requests to the configured AI API.
- \`src/store/\`: Zustand store for state management (persisted in local storage).
- \`src/components/\`: React components forming the layout, sidebar, chat interface, and context panels.
- \`src/services/\`: Contains the \`api.ts\` file which formulates the context and payload sent to the backend.

## Limitations

- The current version relies on local storage for persistence. Clearing browser data will erase your investigation history.
- The assistant does not execute commands on your behalf; you must run the commands in your own authorized terminal and paste the output.

## Future Improvements

- Implementing persistent cloud storage with user authentication.
- Developing a dedicated extension or local agent to semi-automate evidence gathering (with explicit user authorization).

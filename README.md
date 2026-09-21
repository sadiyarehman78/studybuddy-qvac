# StudyBuddy Local AI

> A local AI study assistant powered by the Tether QVAC JavaScript SDK.

StudyBuddy is an on-device AI study assistant that lets students ask questions and receive AI-generated explanations, programming help, and computer-science guidance through a simple web interface.

The application uses the QVAC SDK to load a local Llama 3.2 1B model and generate responses directly through local inference.

## ✨ Features

- 🤖 Local AI inference with QVAC
- 💬 Interactive chat interface
- ⚡ Streaming AI responses
- 📚 Study and concept explanations
- 💻 Programming assistance
- 🌐 Computer-science question answering
- 🔒 Local model inference
- 🧠 Llama 3.2 1B model
- 🎨 Responsive modern interface
- 🚫 No separate cloud AI API key required

## Installation

### Requirements

- Node.js 18+
- npm
- Git
- Internet connection for the first model download

### Setup

Clone the repository:

```bash
git clone https://github.com/sadiyarehman78/studybuddy-qvac.git
cd studybuddy-qvac Install dependencies:

npm install

Set the QVAC configuration path.

Windows PowerShell:

$env:QVAC_CONFIG_PATH = ".\qvac.config.json"

Start the application:

npm start

Open:

http://localhost:3000

The first run downloads and caches the local Llama model through QVAC.

Usage

Enter any study-related question in the chat interface.

Examples:

Explain TCP vs UDP
Write a Java program to reverse a string
Explain machine learning simply

Click Stop while a response is generating to stop the current response.


And your **Features** section can simply be:

```markdown
## Features

- Local AI inference with QVAC
- Llama 3.2 1B model
- Interactive chat UI
- Streaming responses
- Stop generation
- Programming and study assistance
- No separate cloud AI API key required

That's it. Don't make the README a 10-page essay. Reviewers should be able to clone → install → run → test in under a minute.

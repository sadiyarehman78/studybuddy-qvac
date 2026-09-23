# StudyBuddy Local AI

A local AI study assistant powered by the **Tether QVAC JavaScript SDK**.

StudyBuddy uses **Llama 3.2 1B** to provide study explanations, programming help, and answers locally on the device.

## QVAC Integration

This project is built using:

- **QVAC SDK:** `@qvac/sdk@0.19.1`
- **Model:** `Llama 3.2 1B Instruct`
- **Inference:** Local / on-device
- **QVAC functions used:**
  - `loadModel()`
  - `completion()`
  - `unloadModel()`

The application loads the local model using QVAC's `loadModel()` and generates responses using QVAC's `completion()` API.

No cloud AI API is required for inference.

## Features

- 🤖 Local AI study assistant
- 📚 Study and programming explanations
- ⚡ Llama 3.2 1B local inference
- 💬 Streaming AI responses
- ⏹️ Stop generation
- 🌐 Simple web interface

## Installation

```bash
git clone https://github.com/sadiyarehman78/studybuddy-qvac.git
cd studybuddy-local-ai
npm install

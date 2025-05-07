# Customer Support Chatbot

This project implements a **Customer Support Chatbot** using Google Gemini (via GoogleGenerativeAI SDK) to automate responses based on frequently asked questions (FAQs) and product information.

## Features

- **Contextual Responses**: Responds to questions about products, order tracking, return policies, payment methods, and warranties
- **Cache-Augmented Generation (CAG)**: Uses prompt engineering to ensure answers are based on predefined data
- **Multi-turn Conversations**: Maintains context across chat sessions
- **Fallback Mechanism**: Responds with "I'm afraid I can't answer that" for out-of-scope questions

## Setup

### 1. Get Your Google Gemini API Key

1. Sign up for Google Gemini API access
2. Generate an API key from [Google Cloud Console](https://cloud.google.com/)
3. Add your API key to the `.env` file:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your-api-key-here

graph TD
    A[User Question] --> B{In FAQ Data?}
    B -->|Yes| C[Generate Answer]
    B -->|No| D["Return: I can't answer that"]
    C --> E[Display Response]
    D --> E

Running the Project

    Install dependencies:
    bash

npm install

Start development server:
bash

npm run dev

Access at:

http://localhost:3000


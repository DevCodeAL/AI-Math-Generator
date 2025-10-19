# Math Problem Generator - Developer Assessment Starter Kit

## Overview

This is a starter kit for building an AI-powered math problem generator application. The goal is to create a standalone prototype that uses AI to generate math word problems suitable for Primary 5 students, saves the problems and user submissions to a database, and provides personalized feedback.

## Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **AI Integration**: Google Generative AI (Gemini)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd math-problem-generator
```

### 2. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → API to find your:
   - Project URL (starts with `https://`)
   - Anon/Public Key

### 3. Set Up Database Tables

1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `database.sql`
3. Click "Run" to create the tables and policies

### 4. Get Google API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key for Gemini

### 5. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Edit `.env.local` and add your actual keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   GOOGLE_API_KEY=your_actual_google_api_key
   ```

### 6. Install Dependencies

```bash
npm install
```

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Your Task

### 1. Implement Frontend Logic (`app/page.tsx`)

Complete the TODO sections in the main page component:

- **generateProblem**: Call your API route to generate a new math problem
- **submitAnswer**: Submit the user's answer and get feedback

### 2. Create Backend API Route (`app/api/math-problem/route.ts`)

Create a new API route that handles:

#### POST /api/math-problem (Generate Problem)
- Use Google's Gemini AI to generate a math word problem
- The AI should return JSON with:
  ```json
  {
    "problem_text": "A bakery sold 45 cupcakes...",
    "final_answer": 15
  }
  ```
- Save the problem to `math_problem_sessions` table
- Return the problem and session ID to the frontend

#### POST /api/math-problem/submit (Submit Answer)
- Receive the session ID and user's answer
- Check if the answer is correct
- Use AI to generate personalized feedback based on:
  - The original problem
  - The correct answer
  - The user's answer
  - Whether they got it right or wrong
- Save the submission to `math_problem_submissions` table
- Return the feedback and correctness to the frontend

### 3. Requirements Checklist

- [ ] AI generates appropriate Primary 5 level math problems
- [ ] Problems and answers are saved to Supabase
- [ ] User submissions are saved with feedback
- [ ] AI generates helpful, personalized feedback
- [ ] UI is clean and mobile-responsive
- [ ] Error handling for API failures
- [ ] Loading states during API calls

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add your environment variables in Vercel's project settings
4. Deploy!

## Assessment Submission

When submitting your assessment, provide:

1. **GitHub Repository URL**: Make sure it's public
2. **Live Demo URL**: Your Vercel deployment
3. **Supabase Credentials**: Add these to your README for testing:
   ```
   SUPABASE_URL: [Your Supabase Project URL]
   SUPABASE_ANON_KEY: [Your Supabase Anon Key]
   ```

## Implementation Notes

*Please fill in this section with any important notes about your implementation, design decisions, challenges faced, or features you're particularly proud of.*

### My Implementation:

  Setup Steps
- Set up Supabase and obtain the API URL and Anon Key.
- Get the API key from Google Studio AI to generate math problems, feedback, etc.

  Frontend Implementation

  Design and Styling:
- Implemented using Tailwind CSS for a modern SaaS design and responsive layout.

  Function Implementations:
  fetchHistory()
- Used inside useEffect to fetch all history records using the userId stored in localStorage under user_identifier.
- Ensures the correct history is displayed for the logged-in or anonymous user.

  handleClear()
- Clears the current states and history.
- Removes user_identifier from localStorage using
localStorage.removeItem("user_identifier") and remove history from ui.

  showHint() 
- Calls the API to generate AI-generated step-by-step solutions.

  Other Functions:
- submitAnswer()
- generateProblem()

  Backend Implementation
  API Structure:

  api/math-problem/route.tsx
- Handles backend API calls to generate AI-based math problems.

  api/math-problem/submit/route.tsx
- Handles answer submissions, checks correctness, saves submissions, and generates feedback.

  api/math-problem/hint/route.tsx
- Calls the backend API to generate AI hints.
- Install the required package:
- npm install @google/generative-ai
- Uses Google Generative AI with the Gemini-2.0-flash model:
- import { GoogleGenerativeAI } from "@google/generative-ai";

  api/math-problem/history/route.tsx
- Retrieves all history records for each unique user.
- Implements a userId stored as user_identifier in localStorage to ensure unique ownership of histories.

 Challenges Faced
- Honestly, this is my first time implementing AI-generated content in a web app. I learned quickly by reading documentation and using AI as my assistant.
One major challenge was handling the user history. Initially, when the browser was refreshed, the history was not displayed in the UI. After deployment, I also noticed that multiple users could see each other’s histories, which was not intended.
To fix this, I implemented a session ID approach, but the issue persisted — the history disappeared upon refresh. Eventually, I identified the cause: every new session created a new session ID, which prevented proper fetching of history.
My final solution was to use localStorage with a unique anonymous user ID, stored in Supabase as user_identifier using:
const userId = crypto.randomUUID();
This ensures that each user's history remains private and persistent across sessions.

Personal Reflection
- I’m truly proud of this project because I learned something new — integrating AI Models into web applications.This experience gave me a deeper understanding of how Generative AI works and its vital role in modern web development.It inspired me to continue exploring AI integration, and I plan to use what I’ve learned in my personal projects and with my future clients.
This milestone marks an exciting step forward in my journey as a developer.


## Additional Features (Optional)

If you have time, consider adding:

- [ ] Difficulty levels (Easy/Medium/Hard)
- [ ] Problem history view
- [ ] Score tracking
- [ ] Different problem types (addition, subtraction, multiplication, division)
- [ ] Hints system
- [ ] Step-by-step solution explanations

---

Good luck with your assessment! 🎯
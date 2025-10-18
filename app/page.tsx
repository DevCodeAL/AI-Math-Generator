'use client'

import { useEffect, useState } from 'react'
import { supabase, type Database } from '../lib/supabaseClient'

type History = Database["public"]["Tables"]["math_problem_submissions"]["Insert"];

interface MathProblem {
  problem_text: string
  final_answer: number
}

export default function Home() {
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  // Optional Add
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [solutionSteps, setIsSolutionStep] = useState<string>("");
  const [history, setIsHistory] = useState<History[]>([]);
  const [score, setIsScore] = useState<number>(0);
  const [allProblems, setIsAllProblems] = useState<number>(0)
  const [difficulty, setDifficulty] = useState<string>("Easy");
  const [problemType, setProblemType] = useState<string>("Addition");


  // Fetch History
   const fetchHistory = async ()=>{
          try {
            const res = await fetch('/api/math-problem/history');
            const data = await res.json();
            if(data.submissions) {
              const countAllProblems = data.submissions.map((items: History)=> items.problem_text).length;
              const countCorrect = data.submissions.filter((item: History)=> item.is_correct).length;
              setIsAllProblems(countAllProblems);
              setIsScore(countCorrect)
              setIsHistory(data.submissions);
            }
            console.log(data.submissions);
          } catch (error) {
              console.error(error);
          }
      };

    useEffect(()=> {
      fetchHistory();
    }, []);

    // Handle Clear
    const HandleClear = ()=>{
       setIsHistory([]);
       setIsAllProblems(0);
       setIsScore(0);
    }


  const generateProblem = async () => {
    // TODO: Implement problem generation logic
    // This should call your API route to generate a new problem
    // and save it to the database
  setIsLoading(true);
  setShowSolution(false);
  try {
    // Call backend API to generate AI problem
    const res = await fetch("/api/math-problem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generate",
        difficulty,
        problemType,
      }),
    });
    const result = await res.json();

    // Insert problem into Supabase and get inserted row
    const { data, error } = await supabase
      .from("math_problem_sessions")
      .insert([{
        problem_text: result.problem_text,
        correct_answer: Number(result.final_answer)
      }])
      .select()
      .single(); //  get the single inserted row

    if (error) throw error;

    // Set state with sessionId and problem
    setSessionId(data.id);
    setProblem({
      problem_text: data.problem_text,
      final_answer: data.correct_answer
    });

    setFeedback('');
    setUserAnswer('');
    setIsCorrect(null);
    setIsLoading(false);

  } catch (error) {
    console.error(error);
    setIsLoading(false);
  }
};


  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement answer submission logic
    // This should call your API route to check the answer,
    // save the submission, and generate feedback
  if (!sessionId || !problem) {
    console.error("Session ID or problem not set");
    return;
  }
  setIsLoading(true);
  fetchHistory();

  try {
    const res = await fetch('/api/math-problem/submit', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        user_answer: Number(userAnswer),
        correct_answer: Number(problem.final_answer),
        problem_text: problem.problem_text
      })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("API error:", text);
      setIsLoading(false);
      return;
    }

    const data = await res.json();
    setFeedback(data.feedback_text);
    setIsCorrect(data.is_correct);
    setIsLoading(false);
    fetchHistory();
  } catch (error) {
    console.error(error);
    setIsLoading(false);
  }
};

// Show hint
const showHint = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setShowSolution(true);
  if (!sessionId || !problem) {
    console.error("Session ID or problem not set");
    return;
  }

  try {
    const res = await fetch('/api/math-problem/hint', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        problem_text: problem.problem_text
      })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("API error:", text);
      setShowSolution(false);
      return;
    }

    const data = await res.json();
    setIsSolutionStep(data.hint);
    
  } catch (error) {
    console.error(error);
    setIsLoading(false);
  }
};


  return (
   <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center py-8 px-4 sm:px-6">
  <main className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 sm:p-10 space-y-8">

    {/* Header */}
    <header className="text-center space-y-2">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
        Math Problem Generator
      </h1>
      <p className="text-gray-500 text-sm sm:text-lg">
        Practice Primary 5 Math problems generated for you. Improve your skills one problem at a time!
      </p>
    </header>

    {/* Controls: Difficulty + Problem Type */}
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      {/* Difficulty */}
      <div className="flex items-center gap-2">
        <span className="text-gray-700 font-medium">Difficulty:</span>
        <select value={difficulty}
         onChange={(e)=> setDifficulty(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      {/* Problem Type */}
      <div className="flex items-center gap-2">
        <span className="text-gray-700 font-medium">Problem Type:</span>
        <select
        value={problemType}
         onChange={(e)=> setProblemType(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
        >
          <option>Addition</option>
          <option>Subtraction</option>
          <option>Multiplication</option>
          <option>Division</option>
        </select>
      </div>
    </div>

    {/* Generate Button */}
    <div className="flex justify-center">
      <button
        onClick={generateProblem}
        disabled={isLoading}
        className="px-6 sm:px-10 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-2xl shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
      >
        {isLoading ? 'Generating...' : 'Generate New Problem'}
      </button>
    </div>

    {/* Problem Card */}
    {problem && (
      <div className="bg-gray-50 rounded-2xl shadow-md p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">📝 Problem</h2>
          <button
            onClick={showHint}
            className="text-sm sm:text-base text-blue-600 hover:underline focus:outline-none"
          >
            💡 Hint
          </button>
        </div>
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{problem.problem_text}</p>

        <form onSubmit={submitAnswer} className="space-y-4">
          <input
            type="number"
            id="answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm text-gray-900"
            placeholder="Enter your answer"
            required
          />
          <div className='flex justify-center'>
            <button
            type="submit"
            disabled={!userAnswer || isLoading}
            className="w-1/3 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-2xl shadow-md transition transform hover:scale-105 disabled:from-gray-300 disabled:to-gray-400"
          >
            Submit Answer
          </button>
          </div>
        </form>

        {/* Step-by-step Solution (conditionally rendered) */}
        {showSolution && (
        <div className="mt-6 p-6 bg-white rounded-2xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Step-by-Step Solution
            </h3>
            <span className="text-sm text-gray-500 italic">AI Generated</span>
          </div>
          <div className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {solutionSteps.replace(/^\d+\.\s*/gm, '')}
          </div>
        </div>
        )}
      </div>
    )}

    {/* Feedback + Score */}
    <div className="space-y-4 sm:space-y-6">
      {feedback && (
        <div className={`rounded-2xl shadow-md p-4 sm:p-6 border-l-4 ${isCorrect ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-800 flex items-center gap-2">
            {isCorrect ? '✅ Correct!' : '❌ Try Again'}
          </h2>
          <p className="text-gray-700 text-sm sm:text-base">{feedback}</p>
        </div>
      )}

      <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-inner">
        <span className="text-gray-700 font-medium">Score: {`${score}/${allProblems}`}
        </span>
        <button
          onClick={HandleClear}
          className="text-sm text-red-600 hover:underline focus:outline-none"
        >
          Clear History
        </button>
      </div>

      {/* Problem History */}
      <div className="bg-white rounded-lg shadow-inner p-4 max-h-48 overflow-y-auto">
        <h3 className="font-semibold text-gray-800 mb-2">🕒 Problem History</h3>
        <ul className="space-y-1 text-gray-700 text-sm sm:text-base">
          {history?.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span className='text-wrap p-1.5'>{item.problem_text}</span>
              <span className={`text-nowrap p-1.5 ${item.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                {item.is_correct ? `Correct ${item.user_answer}` :   `Wrong ${item.user_answer}`}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </main>
</div>

  )
}
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase, type Database} from "../../../../lib/supabaseClient";

type SubmissionInsert = Database["public"]["Tables"]["math_problem_submissions"]["Insert"];


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { session_id, user_answer, correct_answer, problem_text, user_identifier } =
      await req.json();

    const is_correct = Number(user_answer) === Number(correct_answer);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      You are a Primary 5 Math teacher.
      The student answered this problem:
      "${problem_text}"
      Student's answer: ${user_answer}
      Correct answer: ${correct_answer}
      Give short, encouraging feedback (2-3 sentences) appropriate for a Primary 5 student.
      If the student is correct, praise them and reinforce the concept.
      If the student is wrong, gently explain where the mistake might be and encourage retry.
      Return only plain text.
    `;
    const feedback = (await model.generateContent(prompt)).response.text();

     const submission: SubmissionInsert = {
           session_id,
           user_answer: Number(user_answer),
           is_correct,
           feedback_text: feedback,
           problem_text,
           user_identifier,
    };


    const { data, error } = await supabase
      .from("math_problem_submissions")
      .insert([submission])
      .select();

    if (error) throw error;

    return NextResponse.json({ session_id, user_answer, is_correct, feedback_text: feedback, problem_text, user_identifier });
  } catch (error: any) {
    console.error("Error submitting answer:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

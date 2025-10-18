import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { session_id, problem_text } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      You are a Primary 5 Math teacher.
      Provide a step-by-step hint or solution for this math problem:
      "${problem_text}"
      Make it clear, encouraging, and educational.
      Return only plain text.
    `;

    const hint_response = (await model.generateContent(prompt)).response.text();

    return NextResponse.json({ session_id, hint: hint_response });
  } catch (error: any) {
    console.error("Error generating hint:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { difficulty, problemType } = await req.json();
  try {
    const res = await fetch(
      `${process.env.GEMINI_PROVIDER_URL}key=` +
        process.env.GOOGLE_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
                    You are a Singapore Primary Mathematics teacher following the 2021 Primary Mathematics Syllabus (P1–P6).

                    Generate ONE random math word problem aligned with the syllabus strands:
                    Difficulty: ${difficulty}
                    Problem Type: ${problemType}

                    - Whole Numbers
                    - Fractions
                    - Decimals
                    - Measurement
                    - Geometry
                    - Statistics
                    - Ratio
                    - Percentage
                    - Money
                    - Time
                    - Area and Volume

                    Each problem should be age-appropriate for Primary 5 students.
                    Return ONLY valid JSON in this format (no code blocks, no explanations):

                    {
                    "problem_text": "string",
                    "final_answer": number,
                    }
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    // Gemini native response structure
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // Clean up any accidental formatting
    const cleaned = content
      ?.replace(/^```json\s*/i, "")
      ?.replace(/^```/, "")
      ?.replace(/```$/, "")
      ?.trim();

    let problem;
    try {
      problem = JSON.parse(cleaned);
    } catch {
      console.warn("Gemini returned invalid JSON:", cleaned);
      console.log("Raw Gemini response:", data);
      problem = {
        problem_text: "No problem generated.",
        correct_answer: "",
      };
    }

    return NextResponse.json(problem);
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to generate problem" },
      { status: 500 }
    );
  }
}

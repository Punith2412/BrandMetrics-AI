import { NextRequest, NextResponse } from "next/server";
import { generateBrandStory } from "@/lib/ai";
import { UserAnswers } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const answers: UserAnswers = await req.json();

    if (!answers.name || !answers.profession) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const content = await generateBrandStory(answers);
    return NextResponse.json(content);
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "Failed to generate story" }, { status: 500 });
  }
}

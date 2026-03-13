import { NextRequest, NextResponse } from 'next/server';
import { scoreAnswer } from '@/lib/ai/openai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { generatedSentence, referenceAnswer, answerKeyPoints, userAnswer } = body;

    // OpenAIで採点 (Stage 3)
    const scoring = await scoreAnswer({
      generatedSentence,
      referenceAnswer,
      answerKeyPoints,
      userAnswer,
    });

    return NextResponse.json(scoring);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
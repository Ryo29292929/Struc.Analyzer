import { NextRequest, NextResponse } from 'next/server';
import { findCachedExercise, createClient } from '@/lib/ai/cache';
import { extractStructure, generateExercise } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const { sentence } = await req.json();
    
    // 1. キャッシュを確認（節約機能）
    const cached = await findCachedExercise(sentence);
    if (cached) {
      return NextResponse.json({ ...cached, fromCache: true });
    }

    // 2. Geminiで構造抽出 (Stage 1)
    const syntaxAnalysis = await extractStructure(sentence);

    // 3. Geminiで類似文作成 (Stage 2)
    const generated = await generateExercise(syntaxAnalysis);

    // ※ 本来はここでDBに保存しますが、まずは動作確認優先でレスポンスを返します
    return NextResponse.json({
      generatedSentence: generated.generated_sentence,
      referenceAnswer: generated.reference_answer,
      answerKeyPoints: generated.answer_key_points,
      syntaxAnalysis,
      fromCache: false,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

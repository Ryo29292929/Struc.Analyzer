import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  // ← ここに移動（ビルド時ではなく実行時に初期化）
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { text, systemPrompt } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'テキストがありません' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt || 'あなたは英文解析の専門家です。' },
        { role: 'user', content: text },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content ?? '{}';
    return NextResponse.json(JSON.parse(content));

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
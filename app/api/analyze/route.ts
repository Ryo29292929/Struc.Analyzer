# フォルダ作成
mkdir -p app/api/analyze

# ファイル作成
cat > app/api/analyze/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sentence } = body;

    if (!sentence || typeof sentence !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: sentence }],
      max_tokens: 1000,
    });

    return NextResponse.json({
      result: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
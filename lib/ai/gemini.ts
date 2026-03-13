// lib/ai/gemini.ts

export async function extractStructure(text: string) {
  const STAGE1_SYSTEM = `あなたは英文解釈のプロ講師です。
以下の英文をSVOC要素に分解し、必ず以下のJSON形式のみで返してください：
{
  "elements": [
    { "text": "単語や句", "label": "S/V/O/C/M" }
  ],
  "translation": "自然な日本語訳"
}`;

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, systemPrompt: STAGE1_SYSTEM }),
  });

  if (!response.ok) throw new Error('解析に失敗しました');
  return await response.json();
}

export async function gradeTranslation(userText: string, modelText: string, sentence: string) {
  const GRADING_SYSTEM = `あなたは予備校の英語最高権威です。
ユーザーの和訳を採点し、必ず以下のJSON形式のみで返してください：
{
  "score": 点数（0〜10の整数）,
  "feedback": "採点コメント"
}`;

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `Sentence: ${sentence}\nUser: ${userText}\nModel: ${modelText}`,
      systemPrompt: GRADING_SYSTEM,
    }),
  });

  if (!response.ok) throw new Error('採点に失敗しました');
  return await response.json();
}
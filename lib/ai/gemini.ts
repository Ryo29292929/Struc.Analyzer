// lib/ai/gemini.ts

// 1. 構造解析
export async function extractStructure(text: string) {
  const STAGE1_SYSTEM = "あなたは予備校の最高権威です。英文をSVOC要素に分解しJSONで返してください。";

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: text,
      systemPrompt: STAGE1_SYSTEM
    }),
  });

  if (!response.ok) throw new Error('解析に失敗しました');
  return await response.json();
}

// 2. 演習問題生成（もし使っていれば）
export async function generatePractice(originalResult: any) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `Original Structure: ${JSON.stringify(originalResult.elements)}`,
      systemPrompt: "あなたは予備校の最高権威です。類題を作成してください。"
    }),
  });
  return await response.json();
}

// 3. 精密採点（ここを修正しました）
export async function gradeTranslation(userText: string, modelText: string, sentence: string) {
  const GRADING_SYSTEM = `あなたは予備校の英語最高権威です。ユーザーの和訳を採点してください。`;

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `Sentence: ${sentence}\nUser: ${userText}`,
      systemPrompt: GRADING_SYSTEM
    }),
  });

  if (!response.ok) throw new Error('採点に失敗しました');
  return await response.json();
}
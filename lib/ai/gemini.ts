// 1. 構文解析（APIを叩く関数）
export async function extractStructure(text: string) {
  const STAGE1_SYSTEM = `あなたは予備校の最高権威です。以下の【json】フォーマットのみで回答してください。`; // プロンプトの詳細は省略せず以前のものを使ってください

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

// 2. 添削（APIを叩く関数）
export async function gradeTranslation(text: string, translation: string) {
  const GRADING_SYSTEM = `あなたは予備校の最高権威です。論理的な添削を行ってください。`; // プロンプトの詳細は省略せず以前のものを使ってください

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `Original: ${text}\nTranslation: ${translation}`,
      systemPrompt: GRADING_SYSTEM
    }),
  });

  if (!response.ok) throw new Error('添削に失敗しました');
  return await response.json();
}
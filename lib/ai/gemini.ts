export async function extractStructure(text: string) {
  const STAGE1_SYSTEM = `あなたは予備校の最高権威です。...(中略)...`; 

  // 直接OpenAIを呼ぶのではなく、自作のAPIエンドポイントを叩く
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: text,
      systemPrompt: STAGE1_SYSTEM
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '解析に失敗しました');
  }

  return await response.json();
}
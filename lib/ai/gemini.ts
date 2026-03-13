import OpenAI from 'openai';

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * 1. 英文構文解析
 * 前置詞句のパッケージ化と接続詞の独立、M判定の徹底
 */
const STAGE1_SYSTEM = `あなたは予備校の英語最高権威です。
必ず以下の【json】フォーマットのみで回答してください。

【解析・表示ルール】
1. 前置詞句 (in, at, on, after, for等) は例外なく【M】です。範囲を特定し、必ずカッコ ( ) で括って1つの要素として記載してください。
2. 等位接続詞（and, but, or等）は【独立】させ、ラベルを【＝】としてください。
3. 等位接続詞の後に続く主語や動詞はカッコで括らず、独立した要素として解析してください。
4. JSON以外のテキストは一切含めないでください。

{
  "elements": [ {"text": "単語/句", "label": "S/V/O/C/M/＝"} ],
  "translation": "日本語訳",
  "vocabulary": [ {"word": "単語", "meaning": "意味"} ]
}`;

export async function extractStructure(sentence: string): Promise<any> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: STAGE1_SYSTEM },
      { role: "user", content: `Analyze: "${sentence}"` }
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
  });
  return JSON.parse(response.choices[0].message.content || "{}");
}

/**
 * 2. 演習問題生成
 * 提示時は記号( )や＝を一切含めない「純粋な英文」を生成
 */
export async function generatePractice(originalResult: any): Promise<any> {
  const PRACTICE_SYSTEM = `あなたは予備校の英語最高権威です。
提供された構造と同じで、難易度の高い格調高い長文を1つ作成し【json】で返してください。

【厳守】
1. 提示する practice_sentence には、( ) や ＝ などの記号を【絶対に】含めないでください。純粋な英文のみを出力すること。
2. 手抜きは不合格です。
形式: {"practice_sentence": "記号なしの純粋な英文", "model_translation": "和訳"}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: PRACTICE_SYSTEM },
      { role: "user", content: `Original Structure: ${JSON.stringify(originalResult.elements)}` }
    ],
    response_format: { type: "json_object" },
  });
  return JSON.parse(response.choices[0].message.content || "{}");
}

/**
 * 3. 精密採点 ＋ 演習文の構造提示
 * 採点後の解説で初めて記号を用いてSVOCM＝を視覚的に提示
 */
export async function gradeTranslation(userText: string, modelText: string, sentence: string): Promise<any> {
  const GRADING_SYSTEM = `あなたは予備校の英語最高権威です。
ユーザーの和訳を日本語で採点し、演習文の英語構造を【解析ルール】に従って視覚的に提示してください。

【解析ルール】
1. 前置詞句は ( ) で括り、ラベルを M とすること。
2. 等位接続詞は ＝ とし、その後の要素はカッコに入れず独立させること。
3. 解説（feedback）は必ず【日本語】で行うこと。

形式: 
{
  "score": 10,
  "feedback": "日本語による論理的な添削解説",
  "perfect_translation": "理想の和訳",
  "structural_elements": [ {"text": "(前置詞句) または 単語", "label": "S/V/O/C/M/＝"} ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: GRADING_SYSTEM },
      { role: "user", content: `Grade this in json. Sentence: ${sentence}\nUser: ${userText}` }
    ],
    response_format: { type: "json_object" },
  });
  return JSON.parse(response.choices[0].message.content || "{}");
}
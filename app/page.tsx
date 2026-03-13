"use client";

import { useState } from "react";
import { extractStructure, gradeTranslation } from "@/lib/ai/gemini";

export default function Home() {
  const [sentence, setSentence] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [practice, setPractice] = useState<any>(null);
  const [generatingPractice, setGeneratingPractice] = useState(false);
  const [userTranslation, setUserTranslation] = useState("");
  const [gradeResult, setGradeResult] = useState<any>(null);
  const [grading, setGrading] = useState(false);

  const getLabelColor = (l: string) => {
    const colors: any = { S: 'text-red-600', V: 'text-blue-600', O: 'text-green-600', C: 'text-orange-500', M: 'text-slate-500' };
    return colors[l] || 'text-slate-400';
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    setPractice(null);
    try {
      const data = await extractStructure(sentence);
      setResult(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handlePractice = async () => {
    setGeneratingPractice(true);
    try {
      const PRACTICE_SYSTEM = `あなたは英語教師です。与えられた構造分析を元に類似した練習問題を作り、必ず以下のJSON形式のみで返してください：{"practice_sentence": "英文", "model_translation": "日本語訳"}`;
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: JSON.stringify(result), systemPrompt: PRACTICE_SYSTEM }),
      });
      const data = await res.json();
      setPractice(data);
      setGradeResult(null);
      setUserTranslation("");
    } catch (e) { console.error(e); }
    finally { setGeneratingPractice(false); }
  };

  const handleGrade = async () => {
    setGrading(true);
    try {
      const data = await gradeTranslation(userTranslation, practice.model_translation, practice.practice_sentence);
      setGradeResult(data);
    } catch (e) { console.error(e); }
    finally { setGrading(false); }
  };

  const renderList = (data: any, renderFn: (item: any, i: number) => React.ReactNode) => {
    if (Array.isArray(data)) return data.map(renderFn);
    return null;
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-6">
        <header className="flex justify-between items-center mb-8 px-2">
          <h1 className="text-2xl font-black italic text-[#000] uppercase tracking-tighter">STRUC. <span className="text-blue-600">ANALYZER</span></h1>
          <p className="text-[10px] font-bold text-slate-400">V1.5.8 - VOCABULARY RESTORED</p>
        </header>

        <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200">
          <textarea
            className="w-full p-4 bg-slate-50 border-none rounded-2xl h-32 text-xl text-[#000] font-bold focus:ring-2 focus:ring-blue-500"
            placeholder="解析したい英文を入力..."
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
          />
          <button onClick={handleAnalyze} className="w-full bg-[#000] text-white py-4 rounded-2xl font-black mt-4 shadow-xl active:scale-95 transition">
            {loading ? "最高権威が分析中..." : "構造を解析する"}
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-10 rounded-3xl border border-blue-100 shadow-sm">
              <div className="flex justify-between mb-12">
                <h2 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Syntax Analysis</h2>
                <button onClick={handlePractice} disabled={generatingPractice}
                  className={`${generatingPractice ? 'bg-slate-400' : 'bg-blue-600'} text-white text-[10px] px-6 py-2 rounded-full font-bold shadow-lg transition active:scale-95`}>
                  {generatingPractice ? "生成中..." : "演習問題へ →"}
                </button>
              </div>
              <div className="flex flex-wrap gap-x-10 gap-y-16 px-2">
                {renderList(result.elements, (el: any, i: number) => (
                  <div key={i} className="relative flex flex-col items-center">
                    <span className={`absolute -top-8 font-black text-sm ${getLabelColor(el.label)}`}>{el.label}</span>
                    <span className={`text-2xl font-bold text-[#000] border-t-4 border-slate-50 pt-2 ${el.label === 'M' ? 'italic text-slate-500' : ''}`}>
                      {el.text || el.word}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid
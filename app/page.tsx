"use client";

import React, { useState } from 'react';
import { extractStructure } from '@/lib/ai/gemini';

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const data = await extractStructure(text);
      setResult(data);
    } catch (e) {
      alert("エラーが発生しました。");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-8 text-black text-center">STRUC. ANALYZER</h1>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <textarea
          className="w-full p-4 border rounded-lg mb-4 h-40 text-black focus:ring-2 focus:ring-black outline-none transition-all"
          placeholder="解析したい英文を入力してください..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-black text-white p-4 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {loading ? "最高権威が解析中..." : "構造を解析する"}
        </button>
      </div>

      {result && (
        <div className="mt-8 p-6 border rounded-xl bg-white shadow-lg border-blue-100">
          <h2 className="text-xl font-bold mb-4 text-blue-800 border-b pb-2">解析結果</h2>
          <div className="flex flex-wrap gap-2 text-lg leading-relaxed">
            {result.elements?.map((el: any, i: number) => (
              <span key={i} className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-md text-black">
                <span className="text-gray-800">{el.text}</span>
                <span className="ml-1 text-xs font-black text-blue-600 uppercase">{el.label}</span>
              </span>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">日本文（最高権威訳）</h3>
            <p className="p-4 bg-gray-50 rounded-lg italic text-gray-800 border-l-4 border-gray-300">
              {result.translation}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
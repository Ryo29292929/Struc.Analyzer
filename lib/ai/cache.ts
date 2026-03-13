import crypto from 'crypto';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SyntaxAnalysis } from '@/types';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component では無視
          }
        },
      },
    }
  );
}

export function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function hashText(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex');
}

export async function findCachedExercise(inputText: string) {
  const supabase = await createClient();
  const normalized = normalizeText(inputText);
  const hash = hashText(normalized);

  const { data: inputSentence } = await supabase
    .from('input_sentences')
    .select('id, syntax_analysis')
    .eq('normalized_hash', hash)
    .single();

  if (!inputSentence) return null;

  const { data: exercise } = await supabase
    .from('exercises')
    .select('id, generated_text, reference_answer, answer_key_points')
    .eq('input_sentence_id', inputSentence.id)
    .limit(1)
    .single();

  if (!exercise) return null;

  return {
    exerciseId: exercise.id,
    generatedSentence: exercise.generated_text,
    syntaxAnalysis: inputSentence.syntax_analysis as unknown as SyntaxAnalysis,
  };
}


export interface SyntaxAnalysis {
  sentence_type: 'simple' | 'compound' | 'complex' | 'compound-complex';
  svoc_pattern: string;
  main_clause: {
    subject: string;
    verb: string;
    object: string | null;
    complement: string | null;
    adverbial: string | null;
  };
  subordinate_clauses: Array<{
    type: string;
    connector: string | null;
    modifies_or_functions_as: string;
  }>;
  grammar_themes: string[];
  difficulty: number;
  structure_fingerprint: string;
}

export interface ExerciseData {
  exerciseId: string;
  generatedSentence: string;
  syntaxAnalysis: SyntaxAnalysis;
}

export interface ScoringResult {
  total_score: number;
  breakdown: Array<{
    point: string;
    earned: number;
    max: number;
    comment: string;
  }>;
  overall_feedback: string;
  model_answer: string;
}
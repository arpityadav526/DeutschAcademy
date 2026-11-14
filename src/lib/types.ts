export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type ExerciseType =
  | "fill_in_blank"
  | "multiple_choice"
  | "sentence_reorder"
  | "table_completion"
  | "error_spotting"
  | "transformation"
  | "translation"
  | "dictation"
  | "speaking";

export interface ExerciseItem {
  id: string;
  type: ExerciseType;
  instruction: string;
  prompt: string;
  contextSentence?: string;
  target: string;
  acceptableAnswers?: string[];
  options?: string[];
  tokens?: string[]; // For sentence reordering tiles
  tableData?: {
    headers: string[];
    rows: {
      label: string;
      cells: string[]; // cell text or "" if blank
      blanks: number[]; // indices of blank cells
    }[];
  };
  errorSpotting?: {
    tokens: string[];
    errorIndex: number;
    correctedToken: string;
    explanation: string;
  };
  transformationRule?: {
    from: string;
    to: string;
    baseSentence: string;
  };
  explanation: string;
  grammarTopic: string;
  audioText?: string;
}

export interface WorkedExampleBreakdown {
  part: string;
  role: string;
  explanation?: string;
  caseType?: "nom" | "akk" | "dat" | "gen" | "verb" | "prefix";
}

export interface WorkedExample {
  german: string;
  english: string;
  breakdown: WorkedExampleBreakdown[];
  audioHint?: string;
  note?: string;
}

export interface VocabularyItem {
  article?: "der" | "die" | "das";
  word: string;
  plural?: string;
  english: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "adverb" | "preposition" | "phrase" | "pronoun";
  exampleSentence: string;
  exampleTranslation: string;
  audioText?: string;
}

export interface DeepDiveNote {
  title: string;
  content: string;
  warning?: boolean;
}

export interface GrammarTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface ReadingPassage {
  title: string;
  germanText: string;
  englishSummary: string;
  glossary: {
    word: string;
    meaning: string;
    grammarNote?: string;
  }[];
  comprehensionQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface ListeningDialogue {
  title: string;
  speakers: string[];
  lines: {
    speaker: string;
    text: string;
    translation: string;
  }[];
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface ProductionPrompts {
  writing: {
    prompt: string;
    guidelines: string[];
    sampleResponse: string;
    selfCheckRubric: string[];
  };
  speaking: {
    prompt: string;
    targetSentence: string;
    translation: string;
    phoneticTips: string;
  };
}

export interface UnitContent {
  id: string;
  level: CEFRLevel;
  number: number;
  title: string;
  subtitle: string;
  grammarFocus: string[];
  estimatedMinutes: number;
  concept: {
    title: string;
    explanation: string; // Markdown with grammar markup tags
    tables?: GrammarTable[];
    deepDives?: DeepDiveNote[];
  };
  workedExamples: WorkedExample[];
  guidedPractice: ExerciseItem[];
  vocabulary: VocabularyItem[];
  readingPassage?: ReadingPassage;
  listeningDialogue?: ListeningDialogue;
  production: ProductionPrompts;
  unitTest: {
    passingScore: number; // default 80
    questions: ExerciseItem[];
  };
}

export interface CurriculumUnitSummary {
  id: string;
  number: number;
  title: string;
  description: string;
  grammarFocus: string[];
  vocabularyTheme: string;
  lessonsCount: number;
}

export interface CurriculumLevel {
  id: CEFRLevel;
  name: string;
  description: string;
  estimatedHours: number;
  color: string;
  units: CurriculumUnitSummary[];
}

export interface CurriculumMap {
  levels: CurriculumLevel[];
}

export interface SM2State {
  repetition: number;
  interval: number; // in days
  easeFactor: number;
  nextReviewDate: Date;
}

/**
 * Word-level alignment and similarity checking for German speaking and translation exercises
 */

export interface WordDiff {
  expected: string;
  spoken?: string;
  status: "match" | "mismatch" | "missing" | "extra";
}

export function cleanGermanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'„“»«]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Compares recognized spoken German words with the expected target sentence
 */
export function compareSpokenToTarget(targetSentence: string, spokenText: string): {
  accuracy: number;
  wordDiffs: WordDiff[];
  isPassing: boolean;
} {
  const targetWords = cleanGermanText(targetSentence).split(" ").filter(Boolean);
  const spokenWords = cleanGermanText(spokenText).split(" ").filter(Boolean);

  const wordDiffs: WordDiff[] = [];
  let matchCount = 0;

  const maxLen = Math.max(targetWords.length, spokenWords.length);

  for (let i = 0; i < maxLen; i++) {
    const expected = targetWords[i];
    const spoken = spokenWords[i];

    if (!expected && spoken) {
      wordDiffs.push({
        expected: "",
        spoken,
        status: "extra",
      });
    } else if (expected && !spoken) {
      wordDiffs.push({
        expected,
        status: "missing",
      });
    } else if (expected === spoken) {
      matchCount++;
      wordDiffs.push({
        expected,
        spoken,
        status: "match",
      });
    } else {
      // Check for minor phonetic tolerance (Levenshtein distance <= 1 for words >= 4 letters)
      const dist = levenshteinDistance(expected, spoken);
      if (expected.length >= 4 && dist <= 1) {
        matchCount += 0.85;
        wordDiffs.push({
          expected,
          spoken,
          status: "match",
        });
      } else {
        wordDiffs.push({
          expected,
          spoken,
          status: "mismatch",
        });
      }
    }
  }

  const accuracy = Math.round((matchCount / (targetWords.length || 1)) * 100);
  const isPassing = accuracy >= 75;

  return {
    accuracy,
    wordDiffs,
    isPassing,
  };
}

/**
 * Checks whether user input matches target or any acceptable variants
 */
export function isAnswerCorrect(
  userInput: string,
  target: string,
  acceptableVariants: string[] = []
): { correct: boolean; matchedVariant?: string } {
  const cleanInput = cleanGermanText(userInput);
  const cleanTarget = cleanGermanText(target);

  if (cleanInput === cleanTarget) {
    return { correct: true, matchedVariant: target };
  }

  for (const variant of acceptableVariants) {
    if (cleanInput === cleanGermanText(variant)) {
      return { correct: true, matchedVariant: variant };
    }
  }

  return { correct: false };
}

/**
 * Standard Levenshtein distance
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

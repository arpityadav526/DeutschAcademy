/**
 * Web Speech API wrapper for German Text-to-Speech (TTS) and Speech-to-Text (STT)
 */

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  );
}

/**
 * Speaks German text using browser SpeechSynthesis
 * @param text The German sentence or phrase
 * @param slow Whether to speak slowly for language learners (rate 0.75 vs 1.0)
 */
export function speakGerman(text: string, slow: boolean = false): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isSpeechSynthesisSupported()) {
      return resolve();
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const cleanText = text
        .replace(/<[^>]+>/g, "") // Strip HTML/grammar tags
        .replace(/\[\.\.\.\]/g, "")
        .replace(/\(.*?\)/g, "")
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "de-DE";
      utterance.rate = slow ? 0.75 : 0.95; // 0.75 for slow articulation, 0.95 for natural clear German
      utterance.pitch = 1.0;

      // Try finding a German voice
      const voices = window.speechSynthesis.getVoices();
      const germanVoice = voices.find(
        (v) => v.lang.startsWith("de") || v.lang.replace("_", "-") === "de-DE"
      );
      if (germanVoice) {
        utterance.voice = germanVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.warn("Speech synthesis error:", e);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis failed:", err);
      resolve();
    }
  });
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

/**
 * Creates and starts a speech recognition session for German (de-DE)
 */
export function startGermanListening(
  onResult: (result: SpeechRecognitionResult) => void,
  onError: (error: string) => void,
  onEnd: () => void
): { stop: () => void } | null {
  if (!isSpeechRecognitionSupported()) {
    onError("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
    return null;
  }

  try {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "de-DE";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript;
      const confidence = event.results[last][0].confidence;
      onResult({ transcript, confidence });
    };

    recognition.onerror = (event: any) => {
      onError(event.error || "Speech recognition error");
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      },
    };
  } catch (e: any) {
    onError(e.message || "Failed to initialize speech recognition");
    return null;
  }
}

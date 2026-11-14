"use client";

import React, { useState } from "react";
import { Sparkles, CheckSquare, Send, BookOpen, GraduationCap, Loader2 } from "lucide-react";

interface WritingPrompt {
  id: string;
  level: "A1" | "A2" | "B1" | "B2";
  title: string;
  description: string;
  prompt: string;
  guidelines: string[];
  selfCheckRubric: string[];
}

const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: "a1-intro",
    level: "A1",
    title: "Sich vorstellen (Self-Introduction)",
    description: "Introduce yourself formally to a new study group or prospective language exchange partner.",
    prompt: "Schreiben Sie einen Text über sich: Name, Herkunft, Wohnort, Beruf/Studium, Sprachen und Hobbys.",
    guidelines: [
      "Use 'Mein Name ist...' or 'Ich heiße...'",
      "Conjugate regular and irregular verbs (kommen, wohnen, sprechen, lernen) accurately for 'ich'",
      "Use at least one separable verb (z.B. aufstehen, anfangen)",
      "Ensure all German nouns are capitalized"
    ],
    selfCheckRubric: [
      "Did you place the conjugated verb in Position 2 in declarative sentences?",
      "Are all nouns capitalized (Name, Deutschland, Stadt, Beruf)?",
      "Did you use 'in + city' (in Berlin) and 'aus + country' (aus Spanien)?"
    ]
  },
  {
    id: "a2-vacation",
    level: "A2",
    title: "Mein letzter Urlaub (Past Vacation Narrative in Perfekt)",
    description: "Describe a past trip or memorable weekend using the conversational past tense (Perfekt).",
    prompt: "Erzählen Sie von Ihrem letzten Urlaub: Wohin sind Sie gereist? Wie sind Sie gefahren? Was haben Sie gemacht?",
    guidelines: [
      "Use the Perfekt tense with 'haben' and 'sein' (z.B. Ich bin nach Wien gefahren, ich habe ein Museum besucht)",
      "Place the auxiliary verb in Position 2 and the Partizip II at the very end of the sentence",
      "Use two-way prepositions for locations (z.B. im Hotel, am Strand)",
      "Include causal connector 'weil' with verb-final word order"
    ],
    selfCheckRubric: [
      "Did you use 'sein' with movement verbs (gefahren, geflogen, gegangen)?",
      "Did you place the Partizip II at the very end of each clause?",
      "Did you put the verb at the end after 'weil'?"
    ]
  },
  {
    id: "b1-email",
    level: "B1",
    title: "Höfliche Beschwerde-E-Mail (Formal Complaint Email)",
    description: "Write a standard-compliant formal complaint email to an online retailer or hotel management.",
    prompt: "Schreiben Sie eine förmliche Beschwerde-E-Mail an das Hotel 'Alpenblick' über ein lautes Zimmer und fehlendes WLAN.",
    guidelines: [
      "Use the formal opening 'Sehr geehrte Damen und Herren,'",
      "State the reason for writing in the opening sentence",
      "Use Konjunktiv II for polite demands (z.B. 'Ich wäre Ihnen dankbar, wenn...')",
      "Conclude with 'Mit freundlichen Grüßen'"
    ],
    selfCheckRubric: [
      "Did you follow DIN formal email conventions?",
      "Did you use Konjunktiv II for polite requests (könnten, würden, wäre)?",
      "Is the address pronoun 'Sie / Ihnen / Ihr' capitalized throughout?"
    ]
  },
  {
    id: "b2-essay",
    level: "B2",
    title: "Erörterung: Homeoffice vs. Büro (Argumentative Essay)",
    description: "Structure a balanced opinion essay presenting arguments for and against remote work.",
    prompt: "Verfassen Sie eine strukturierte Stellungnahme zum Thema 'Vor- und Nachteile der Arbeit im Homeoffice'.",
    guidelines: [
      "Provide an introduction defining the modern shift toward remote work",
      "Present at least two advantages (Pro-Argumente) with concrete examples",
      "Present at least two counterarguments (Kontra-Argumente) using advanced connectors (e.g. einerseits... andererseits, obwohl, dennoch)",
      "Synthesize your personal viewpoint in the conclusion"
    ],
    selfCheckRubric: [
      "Did you use high-register connectors (obwohl, indem, demnach, folglich)?",
      "Did you avoid informal colloquialisms?",
      "Is your argumentation structured systematically (These, Begründung, Beispiel)?"
    ]
  }
];

export default function WritingStudioPage() {
  const [selectedPromptId, setSelectedPromptId] = useState(WRITING_PROMPTS[0].id);
  const [userText, setUserText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [rubricChecked, setRubricChecked] = useState<Record<number, boolean>>({});

  const activePrompt =
    WRITING_PROMPTS.find((p) => p.id === selectedPromptId) || WRITING_PROMPTS[0];

  const handlePromptChange = (id: string) => {
    setSelectedPromptId(id);
    setUserText("");
    setFeedback(null);
    setRubricChecked({});
  };

  const handleEvaluate = async () => {
    if (!userText.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/writing/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: userText,
          prompt: activePrompt.prompt,
          level: activePrompt.level,
        }),
      });

      const data = await res.json();
      setFeedback(data.feedback);
    } catch {
      setFeedback(
        "Could not contact evaluator service. Please use the self-check rubric below to review case endings, verb position, and orthography."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-indigo-700" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
            Writing Practice Studio (Schreibwerkstatt)
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Craft structured German essays and correspondence across CEFR levels. Features Claude AI grammatical analysis with automated self-check fallbacks.
        </p>
      </div>

      {/* Level / Prompt Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        {WRITING_PROMPTS.map((p) => {
          const isSelected = p.id === activePrompt.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePromptChange(p.id)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
              }`}
            >
              <div className="text-[10px] font-mono uppercase font-bold tracking-wider mb-0.5 opacity-80">
                Level {p.level}
              </div>
              <div className="text-xs font-bold truncate">{p.title}</div>
            </button>
          );
        })}
      </div>

      {/* Active Prompt Panel */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-mono font-bold">
              {activePrompt.level} Assignment
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              {activePrompt.title}
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {activePrompt.description}
          </p>
        </div>

        {/* Prompt Card */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Assignment Prompt:
          </div>
          <div className="text-sm font-serif font-bold text-slate-900">
            {activePrompt.prompt}
          </div>
          <div className="pt-2 border-t border-slate-200/60 space-y-1">
            <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Stylistic & Grammatical Guidelines:
            </div>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
              {activePrompt.guidelines.map((g, idx) => (
                <li key={idx}>{g}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Writing input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">
            Your German Composition:
          </label>
          <textarea
            rows={8}
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            placeholder="Write your text here in natural German..."
            className="w-full p-4 font-serif text-sm text-slate-900 rounded-lg border border-slate-300 focus:border-slate-800 focus:outline-none shadow-inner leading-relaxed resize-y"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center pt-2">
          <div className="text-xs text-slate-400 font-mono">
            {userText.split(/\s+/).filter(Boolean).length} words
          </div>

          <button
            type="button"
            onClick={handleEvaluate}
            disabled={!userText.trim() || isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400" />
            )}
            <span>{isLoading ? "Analyzing..." : "Evaluate Writing"}</span>
          </button>
        </div>

        {/* Feedback Report */}
        {feedback && (
          <div className="p-5 rounded-lg bg-indigo-50/70 border border-indigo-200 space-y-2 animate-in fade-in">
            <div className="font-bold text-indigo-950 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Diagnostic Feedback & Evaluation Report</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-sans">
              {feedback}
            </div>
          </div>
        )}

        {/* Self-check checklist */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
          <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-slate-600" />
            <span>Self-Correction Diagnostic Rubric:</span>
          </div>
          <div className="space-y-1.5">
            {activePrompt.selfCheckRubric.map((item, idx) => (
              <label
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={Boolean(rubricChecked[idx])}
                  onChange={() =>
                    setRubricChecked({
                      ...rubricChecked,
                      [idx]: !rubricChecked[idx],
                    })
                  }
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-800 mt-0.5"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

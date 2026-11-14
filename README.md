# DeutschAcademy

**DeutschAcademy** is a structured, teaching-first German language platform that guides learners systematically from zero (CEFR A1) through to B2 and C1. 

Designed for adult learners, university students, and serious professionals, DeutschAcademy deliberately rejects childish gamification gimmicks (no cartoon mascots, no streak anxiety, no hearts, no confetti) in favor of **deep conceptual mastery, grammatical rigor, and active language production**.

---

## Pedagogical Philosophy

1. **Teach the WHY before drilling the WHAT**: Every lesson starts with an in-depth textbook-level explanation of the grammatical mechanic, complete with declension matrices, phonetic guides, and collapsible teacher deep-dive notes (*Grammatik-Tipp* and *Achtung!*).
2. **Grammar & Sentence-Building as the Backbone**: German syntax is an architectural system. Vocabulary is acquired inside real sentence brackets (*Satzklammer*), never as isolated flashcards.
3. **Contextual Spaced Repetition (SM-2)**: The SuperMemo-2 spaced repetition algorithm is used exclusively for long-term retention of previously learned patterns via contextual cloze sentences.
4. **Active Production (Speaking & Writing)**: Learners must produce German:
   - Spoken verbal drills with native Web Speech synthesis and speech-recognition comparison (highlighting pronunciation discrepancies at the word level).
   - Structured writing assignments evaluated by an optional Claude API integration (or a comprehensive self-correction diagnostic rubric).
5. **Color-Coded Grammar Markings**:
   - **Nominative / Masculine**: Blue (`<nom>der Mann</nom>`)
   - **Accusative / Feminine**: Red (`<akk>den Mann</akk>`)
   - **Dative**: Amber (`<dat>dem Mann</dat>`)
   - **Genitive**: Green (`<gen>des Mannes</gen>`)
   - **Verb Anchor / Satzklammer**: Purple (`<verb>kann ... sprechen</verb>`)
   - **Separable Verb Prefix**: Pink (`<prefix>auf</prefix>`)

---

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Database**: SQLite with Prisma ORM (zero-friction local execution, easily portable to PostgreSQL/Supabase)
- **Audio & Speech**: Browser-native Web Speech API (`SpeechSynthesis` with `de-DE` normal 1.0x and slow 0.75x modes; `SpeechRecognition` with word-by-word diff)
- **AI Writing Assessment**: Anthropic Claude API (`claude-3-5-sonnet`) with automatic fallback to structured self-check rubrics when no API key is provided
- **Icons**: Lucide React

---

## Quick Start & Setup

### 1. Prerequisites
- **Node.js**: v18.18 or higher (v20+ recommended)
- **npm** / **pnpm** / **yarn**

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Contents of `.env`:
```env
# Local SQLite database path
DATABASE_URL="file:./dev.db"

# Optional: Anthropic Claude API key for automated writing feedback
# (If omitted, the platform automatically provides a comprehensive self-check rubric)
ANTHROPIC_API_KEY=""

# Secret for session cookie hashing
SESSION_SECRET="deutschacademy_academic_secret_dev_key_2026"
```

### 4. Initialize Database
Push the Prisma schema to create the local SQLite database file:
```bash
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Curriculum Architecture & Covered Topics

Master curriculum definition lives in `content/curriculum.json`:

- **A1: Breakthrough (Units 1–14)** *(Full, production-ready content included)*:
  - Unit 1: Alphabet, Pronunciation & German Phonetics (Umlauts ä/ö/ü, ß, ch/sch, ei vs. ie, sp/st)
  - Unit 2: Greetings, Personal Pronouns & Regular Verb Conjugation
  - Unit 3: Irregular Present Tense Verbs & Auxiliaries (*sein* & *haben*, stem vowel shifts)
  - Unit 4: Nouns, Articles (*der/die/das/ein/kein*) & Suffix Gender Strategies
  - Unit 5: Plural Forms of German Nouns (5 patterns & umlaut shifts)
  - Unit 6: German Word Order: The Verb-Second (V2) Rule & Inversion
  - Unit 7: Forming Questions: W-Fragen, Ja/Nein-Fragen & the particle *doch*
  - Unit 8: Negation: *nicht* vs. *kein*
  - Unit 9: Numbers, Time, Dates & Calendar (*um*, *am*, *im*, *halb*, *viertel*)
  - Unit 10: The Cases: Nominative and Accusative (masculine shift, accusative prepositions)
  - Unit 11: Modal Verbs & Dual-Verb Sentence Brackets (*Satzklammer*)
  - Unit 12: Separable & Inseparable Verbs (*Trennbare* vs. *Untrennbare Verben*)
  - Unit 13: The Imperative Mood (*du*, *ihr*, *Sie*, and softening with *bitte/mal*)
  - Unit 14: Comprehensive A1 Review & Capstone Benchmark Evaluation

- **A2: Elementary Foundation (Units 1–10)** *(Units 1 & 2 fully populated as reference)*:
  - Unit 1: The Dative Case: Indirect Objects & Dative Verbs (*dem/der/dem/den + -n*, *helfen*, *danken*, *gefallen*)
  - Unit 2: Two-Way Prepositions (*Wechselpräpositionen*: *Wohin?* Akk vs. *Wo?* Dat; *stellen/stehen*, *legen/liegen*)
  - Units 3–10: *Perfekt*, *Präteritum*, Reflexive Verbs, Subordinate Clauses (*weil*, *dass*, *wenn*, *ob*), Comparatives, Adjective Endings Intro, Possessive Articles, Combined Pronouns.

- **B1: Intermediate Fluency (Units 1–12)**:
  - Full Adjective Declension, Genitive Case, *Präteritum*, *Plusquamperfekt*, *Futur I*, Relative Clauses, *Konjunktiv II*, Passive Voice (*Vorgangspassiv*), Infinitive Clauses with *zu*, Two-Part Connectors (*entweder...oder*, *sowohl...als auch*), Verbs with Fixed Prepositions.

- **B2: Professional Competence (Units 1–9)**:
  - *Konjunktiv I* and Indirect Speech, Passive Variants & *Zustandspassiv*, Extended Participial Attributes, Nominalisation (*Nominalstil*), Advanced Connectors (*obwohl*, *indem*, *sodass*, *trotzdem*), Formal Correspondence (DIN 5008), Argumentation Essays, Idioms & Collocations.

- **C1: Advanced Mastery Extension (Units 1–5)**:
  - Complex Syntax & Inversion Structures, Modal Particles (*ja*, *doch*, *mal*, *eben*, *halt*), Noun-Verb Collocations (*Funktionsverbgefüge*), Cohesion, and Literary/Academic Analysis.

---

## How to Add New Lessons

All course content is completely decoupled from application code in `/content`:

### Directory Layout
```
content/
├── curriculum.json
├── courses/
│   ├── a1/
│   │   ├── unit-01.json
│   │   └── ...
│   ├── a2/
│   │   ├── unit-01.json
│   │   ├── unit-02.json
│   │   └── unit-03.json (add new unit here)
│   ├── b1/
│   ├── b2/
│   └── c1/
└── grammar/
    ├── cases.json
    ├── prepositions.json
    ├── verbs.json
    ├── adjective-endings.json
    └── connectors.json
```

### Unit File Schema (`unit-XX.json`)
Every unit JSON must conform to the following schema:
```json
{
  "id": "unit-03",
  "level": "A2",
  "number": 3,
  "title": "The Perfekt Tense: Conversational Past",
  "subtitle": "Speak about past experiences using haben/sein + Partizip II",
  "grammarFocus": ["Auxiliary Choice (haben vs. sein)", "Partizip II Formations", "Sentence Bracket with Participles"],
  "estimatedMinutes": 50,
  "concept": {
    "title": "Conversational Past in German",
    "explanation": "Markdown text with color tokens: <nom>subject</nom>, <akk>object</akk>, <verb>hat</verb> ... <verb>gelernt</verb>.",
    "tables": [
      {
        "caption": "Regular Participle Formations",
        "headers": ["Infinitive", "Partizip II", "Auxiliary"],
        "rows": [["lernen", "gelernt", "hat"], ["reisen", "gereist", "ist"]]
      }
    ],
    "deepDives": [
      {
        "title": "Verbs of Motion take sein",
        "content": "Verbs describing a change of location (gehen, fahren, fliegen) take sein as auxiliary.",
        "warning": false
      }
    ]
  },
  "workedExamples": [
    {
      "german": "Ich bin gestern nach Köln gefahren.",
      "english": "I traveled to Cologne yesterday.",
      "breakdown": [
        {"part": "Ich", "role": "Subject", "caseType": "nom"},
        {"part": "bin", "role": "Auxiliary in V2", "caseType": "verb"},
        {"part": "gefahren", "role": "Partizip II at end", "caseType": "verb"}
      ]
    }
  ],
  "guidedPractice": [
    {
      "id": "a2-u03-e1",
      "type": "fill_in_blank",
      "instruction": "Insert the auxiliary (haben or sein):",
      "prompt": "Wir ___ gestern viel gelernt.",
      "target": "haben",
      "acceptableAnswers": ["haben"],
      "explanation": "Lernen is a transitive action and takes haben.",
      "grammarTopic": "Auxiliary Choice"
    }
  ],
  "vocabulary": [
    {
      "article": "der",
      "word": "Urlaub",
      "plural": "Urlaube",
      "english": "vacation / holiday",
      "partOfSpeech": "noun",
      "exampleSentence": "Wir haben einen schönen Urlaub gemacht.",
      "exampleTranslation": "We had a wonderful vacation."
    }
  ],
  "readingPassage": {
    "title": "Ein Wochenende in Hamburg",
    "germanText": "Am Wochenende sind wir nach Hamburg gefahren...",
    "englishSummary": "On the weekend we traveled to Hamburg...",
    "glossary": [{"word": "gefahren", "meaning": "traveled"}],
    "comprehensionQuestions": [
      {
        "question": "Wohin sind sie gefahren?",
        "options": ["Berlin", "Hamburg", "Köln"],
        "correctIndex": 1,
        "explanation": "Text states: 'nach Hamburg gefahren'."
      }
    ]
  },
  "listeningDialogue": {
    "title": "Gespräch über das Wochenende",
    "speakers": ["Lisa", "Tom"],
    "lines": [{"speaker": "Lisa", "text": "Was hast du gemacht?", "translation": "What did you do?"}],
    "questions": [
      {
        "question": "Was hat Tom gemacht?",
        "options": ["Er hat gearbeitet", "Er hat geschlafen"],
        "correctIndex": 0,
        "explanation": "Tom hat gearbeitet."
      }
    ]
  },
  "production": {
    "writing": {
      "prompt": "Erzählen Sie von gestern (3-5 Sätze im Perfekt).",
      "guidelines": ["Use haben and sein", "Put Partizip II at the end"],
      "sampleResponse": "Gestern bin ich um 7 Uhr aufgestanden...",
      "selfCheckRubric": ["Auxiliary in Position 2?", "Partizip II at the end?"]
    },
    "speaking": {
      "prompt": "Speak aloud:",
      "targetSentence": "Ich habe gestern ein Buch gelesen und bin spazieren gegangen.",
      "translation": "I read a book yesterday and went for a walk.",
      "phoneticTips": "Articulate ge- prefixes clearly."
    }
  },
  "unitTest": {
    "passingScore": 80,
    "questions": [
      {
        "id": "u03-t1",
        "type": "multiple_choice",
        "instruction": "Auxiliary check:",
        "prompt": "Er ___ nach Hause gegangen.",
        "target": "ist",
        "options": ["hat", "ist", "wird"],
        "explanation": "gehen is a motion verb and takes sein: er ist gegangen.",
        "grammarTopic": "Auxiliary Choice"
      }
    ]
  }
}
```

---

## Supported Exercise Types

1. `fill_in_blank`: Cloze sentence with contextual placeholder and flexible acceptable answers.
2. `multiple_choice`: Conceptual multiple-choice with detailed explanatory feedback on error.
3. `sentence_reorder`: Interactive tiles drilling German V2 word order and Satzklammer.
4. `table_completion`: Conjugation and declension grids with interactive blanks.
5. `error_spotting`: Spot the grammatical error in a sentence by clicking on the incorrect word.
6. `transformation`: Transform sentences (e.g. statement to question, singular to plural, active to passive).
7. `translation`: Smart English-to-German translation with variant checking and word diff.
8. `dictation`: Native German TTS audio dictation testing listening and orthography.
9. `speaking`: Browser speech recognition comparing spoken German against the target sentence with word-level feedback.

---

## License & Pedagogy

DeutschAcademy is designed for serious learners aiming for academic and professional fluency in the German language.

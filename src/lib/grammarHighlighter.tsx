import React from "react";

interface GrammarHighlightProps {
  content: string;
  className?: string;
}

/**
 * Parses custom grammar markup tags into semantic, color-coded inline badges:
 * <nom>text</nom>       -> Nominative (Blue)
 * <akk>text</akk>       -> Accusative (Red)
 * <dat>text</dat>       -> Dative (Amber)
 * <gen>text</gen>       -> Genitive (Green)
 * <verb>text</verb>     -> Verb / Position (Purple)
 * <prefix>text</prefix> -> Separable prefix (Pink)
 * <rule>text</rule>     -> Grammatical rule or pattern (Slate/Indigo badge)
 */
export function GrammarText({ content, className = "" }: GrammarHighlightProps) {
  if (!content) return null;

  // Split string into plain text and tag segments
  const regex = /<(\w+)(?:\s+[^>]+)?>([\s\S]*?)<\/\1>|(\n\n|\n)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  let keyCounter = 0;

  while ((match = regex.exec(content)) !== null) {
    // Plain text before the tag
    if (match.index > lastIndex) {
      elements.push(
        <span key={`text-${keyCounter++}`}>
          {content.substring(lastIndex, match.index)}
        </span>
      );
    }

    if (match[3]) {
      // Newline
      elements.push(
        match[3] === "\n\n" ? (
          <span key={`br-${keyCounter++}`} className="block my-2" />
        ) : (
          <br key={`br-${keyCounter++}`} />
        )
      );
    } else {
      const tag = match[1].toLowerCase();
      const text = match[2];

      switch (tag) {
        case "nom":
          elements.push(
            <span
              key={`nom-${keyCounter++}`}
              className="inline-block px-1.5 py-0.5 mx-0.5 rounded font-medium bg-blue-50 text-blue-800 border border-blue-200 text-sm"
              title="Nominativ (Subject)"
            >
              {text}
            </span>
          );
          break;
        case "akk":
          elements.push(
            <span
              key={`akk-${keyCounter++}`}
              className="inline-block px-1.5 py-0.5 mx-0.5 rounded font-medium bg-red-50 text-red-800 border border-red-200 text-sm"
              title="Akkusativ (Direct Object)"
            >
              {text}
            </span>
          );
          break;
        case "dat":
          elements.push(
            <span
              key={`dat-${keyCounter++}`}
              className="inline-block px-1.5 py-0.5 mx-0.5 rounded font-medium bg-amber-50 text-amber-800 border border-amber-200 text-sm"
              title="Dativ (Indirect Object / Static Location)"
            >
              {text}
            </span>
          );
          break;
        case "gen":
          elements.push(
            <span
              key={`gen-${keyCounter++}`}
              className="inline-block px-1.5 py-0.5 mx-0.5 rounded font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm"
              title="Genitiv (Possession / Relation)"
            >
              {text}
            </span>
          );
          break;
        case "verb":
          elements.push(
            <span
              key={`verb-${keyCounter++}`}
              className="inline-block px-1.5 py-0.5 mx-0.5 rounded font-semibold bg-purple-50 text-purple-800 border border-purple-200 text-sm underline decoration-purple-400 decoration-2"
              title="Verb Position"
            >
              {text}
            </span>
          );
          break;
        case "prefix":
          elements.push(
            <span
              key={`pref-${keyCounter++}`}
              className="inline-block px-1.5 py-0.5 mx-0.5 rounded font-medium bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-200 text-sm"
              title="Separable Verb Prefix"
            >
              {text}
            </span>
          );
          break;
        case "rule":
          elements.push(
            <span
              key={`rule-${keyCounter++}`}
              className="inline-block px-2 py-0.5 mx-1 font-mono text-xs rounded bg-slate-100 text-slate-800 border border-slate-300 font-semibold"
            >
              {text}
            </span>
          );
          break;
        default:
          elements.push(
            <span key={`gen-${keyCounter++}`} className="font-semibold text-slate-900">
              {text}
            </span>
          );
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    elements.push(
      <span key={`text-tail-${keyCounter++}`}>{content.substring(lastIndex)}</span>
    );
  }

  return <span className={`leading-relaxed ${className}`}>{elements}</span>;
}

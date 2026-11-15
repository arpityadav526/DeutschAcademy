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
              className="grammar-inline case-nom"
              title="Nominativ (Nom.)"
            >
              {text}<span className="case-tag">Nom.</span>
            </span>
          );
          break;
        case "akk":
          elements.push(
            <span
              key={`akk-${keyCounter++}`}
              className="grammar-inline case-akk"
              title="Akkusativ (Akk.)"
            >
              {text}
            </span>
          );
          break;
        case "dat":
          elements.push(
            <span
              key={`dat-${keyCounter++}`}
              className="grammar-inline case-dat"
              title="Dativ (Dat.)"
            >
              {text}
            </span>
          );
          break;
        case "gen":
          elements.push(
            <span
              key={`gen-${keyCounter++}`}
              className="grammar-inline case-gen"
              title="Genitiv (Gen.)"
            >
              {text}
            </span>
          );
          break;
        case "verb":
          elements.push(
            <span
              key={`verb-${keyCounter++}`}
              className="verb-pos"
              title="Verbposition — Verbzweitstellung / Verbendstellung"
            >
              {text}
            </span>
          );
          break;
        case "prefix":
          elements.push(
            <span
              key={`pref-${keyCounter++}`}
              className="grammar-inline grammar-prefix"
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
              className="grammar-rule-mark"
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

import React from "react";
import { getAllGrammarTopics } from "@/lib/content";
import { GrammarHandbookClient } from "./GrammarHandbookClient";
import { FachwerkDivider } from "@/components/journey/JourneyUI";

export default function GrammarReferencePage() {
  const topics = getAllGrammarTopics();
  return <div className="grammar-atlas" data-region="schwarzwald"><header className="grammar-atlas-head"><p className="eyebrow">Nachschlagewerk · Grammatik-Atlas</p><h1>Fälle, Formen <span>&amp;</span> Satzbau</h1><p>Find your rule by topic or by station. A reference for the grammar encountered along the route.</p><FachwerkDivider /></header><div className="book-page"><GrammarHandbookClient topics={topics} /></div></div>;
}

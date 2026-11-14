import fs from "fs";
import path from "path";
import {
  CurriculumMap,
  CurriculumLevel,
  UnitContent,
  CEFRLevel,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getCurriculum(): CurriculumMap {
  const filePath = path.join(CONTENT_DIR, "curriculum.json");
  if (!fs.existsSync(filePath)) {
    throw new Error(`Curriculum file not found at ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export function getLevelCurriculum(level: CEFRLevel): CurriculumLevel | undefined {
  const curriculum = getCurriculum();
  return curriculum.levels.find(
    (l) => l.id.toLowerCase() === level.toLowerCase()
  );
}

export function getUnitContent(level: string, unitId: string): UnitContent | null {
  const normalizedLevel = level.toLowerCase();
  const filePath = path.join(
    CONTENT_DIR,
    "courses",
    normalizedLevel,
    `${unitId}.json`
  );

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as UnitContent;
}

export function getAllUnitsForLevel(level: string): UnitContent[] {
  const normalizedLevel = level.toLowerCase();
  const dirPath = path.join(CONTENT_DIR, "courses", normalizedLevel);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".json"))
    .sort();

  return files.map((f) => {
    const raw = fs.readFileSync(path.join(dirPath, f), "utf-8");
    return JSON.parse(raw) as UnitContent;
  });
}

export interface GrammarReferenceTopic {
  id: string;
  title: string;
  summary: string;
  level: string;
  tables: {
    title: string;
    description?: string;
    headers: string[];
    rows: string[][];
  }[];
  rules: {
    name: string;
    explanation: string;
    examples: { german: string; english: string; breakdown?: string }[];
  }[];
}

export function getGrammarReference(topicId: string): GrammarReferenceTopic | null {
  const filePath = path.join(CONTENT_DIR, "grammar", `${topicId}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function getAllGrammarTopics(): GrammarReferenceTopic[] {
  const dirPath = path.join(CONTENT_DIR, "grammar");
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".json"));
  return files.map((f) => JSON.parse(fs.readFileSync(path.join(dirPath, f), "utf-8")));
}

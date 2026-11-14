import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const { text, prompt, level = "A1" } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    let feedback = "";

    if (apiKey && apiKey.trim().length > 0) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1000,
            system:
              "You are an expert, academic German language teacher. Review the student's German writing. Provide constructive, precise feedback: 1) Grammatical correctness (highlight case, verb position, gender errors), 2) Sentence structure critique, 3) Natural German phrasing alternative, 4) Estimated CEFR level of the submission. Keep explanations clear, academic, and encouraging without condescension.",
            messages: [
              {
                role: "user",
                content: `Prompt: "${prompt}"\nTarget Level: ${level}\n\nStudent German Submission:\n"""\n${text}\n"""`,
              },
            ],
          }),
        });

        if (response.ok) {
          const result = await response.json();
          feedback =
            result.content?.[0]?.text || "Feedback generated successfully.";
        } else {
          throw new Error("Anthropic API returned error");
        }
      } catch {
        feedback = generateRuleBasedFeedback(text);
      }
    } else {
      feedback = generateRuleBasedFeedback(text);
    }

    // Save writing submission if user is authenticated
    if (user) {
      await prisma.writingSubmission.create({
        data: {
          userId: user.id,
          promptId: prompt.slice(0, 50),
          level,
          userText: text,
          feedback,
        },
      });
    }

    return NextResponse.json({ feedback });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function generateRuleBasedFeedback(text: string): string {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter(Boolean);

  const capitalNounNotice = words.some((w) => /^[a-zäöü]/.test(w) && w.length > 5)
    ? "• Orthography Check: Ensure all German nouns (Substantive) begin with a capital letter (e.g., der Tisch, das Haus, die Schule).\n"
    : "• Orthography Check: Capitalization looks generally consistent.\n";

  const v2Notice =
    "• Verb Position (V2 Check): In standard declarative German main clauses, your conjugated verb must occupy exactly Position 2. Check each clause to confirm your finite verb is in second position.\n";

  const caseNotice =
    "• Case Verification (Kasus): Review all direct objects to ensure masculine nouns received the accusative marker ('den' / 'einen' / '-en' endings). Ensure subjects are in the nominative case.\n";

  return `### Academic Structural Evaluation (Local Rubric Benchmark)
Your submission contains ${sentences.length} sentences and ${words.length} words.

${capitalNounNotice}
${v2Notice}
${caseNotice}
• Suggested Next Step: Read your submission aloud and verify that time expressions precede place expressions (Time-Manner-Place / TeKaMoLo rule: Wann? Wie? Wo?).`;
}

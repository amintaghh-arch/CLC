import { NextRequest, NextResponse } from "next/server";
import { callGeminiJSON } from "@/lib/gemini";
import { OptimizationResult } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { cvText } = await req.json();
    if (!cvText || typeof cvText !== "string") {
      return NextResponse.json({ error: "cvText manquant." }, { status: 400 });
    }

    const prompt = `Tu es un redacteur professionnel specialise en CV et en optimisation ATS. Reecris le CV suivant : utilise davantage de verbes d'action, un vocabulaire plus professionnel, supprime les repetitions, et optimise-le pour les logiciels de suivi de candidature (ATS), sans inventer d'experiences qui n'existent pas.

CV original :
"""
${cvText}
"""

Fournis la version amelioree complete, la liste des changements effectues, et une breve explication pour chaque changement important.`;

    const schema = `{
  "version_amelioree": "",
  "changements_effectues": [""],
  "explications": [""]
}`;

    const result = await callGeminiJSON<OptimizationResult>(prompt, schema);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

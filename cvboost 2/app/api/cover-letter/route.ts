import { NextRequest, NextResponse } from "next/server";
import { callGeminiJSON } from "@/lib/gemini";

interface CoverLetterResult {
  lettre: string;
}

export async function POST(req: NextRequest) {
  try {
    const { cvText, company, position, tone } = await req.json();
    if (!cvText || !company || !position) {
      return NextResponse.json(
        { error: "cvText, company et position sont requis." },
        { status: 400 }
      );
    }

    const prompt = `Redige une lettre de motivation en francais pour le poste de "${position}" chez "${company}", en te basant sur le profil du candidat ci-dessous. Ton souhaite : ${tone || "professionnel"}.

Profil / CV :
"""
${cvText}
"""

La lettre doit etre personnalisee, concrete (s'appuyer sur de vraies experiences du CV), et tenir sur une page.`;

    const schema = `{ "lettre": "" }`;

    const result = await callGeminiJSON<CoverLetterResult>(prompt, schema);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { callGeminiJSON } from "@/lib/gemini";
import { AnalysisResult } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { cvText } = await req.json();
    if (!cvText || typeof cvText !== "string") {
      return NextResponse.json({ error: "cvText manquant." }, { status: 400 });
    }

    const prompt = `Tu es un recruteur senior et expert ATS. Analyse le CV suivant et note-le honnetement.

CV :
"""
${cvText}
"""

Fournis : un score global sur 100, un score ATS sur 100, et des scores sur 100 pour la mise en page, la lisibilite, l'impact, l'experience, les competences et les mots-cles. Liste les points forts, les points faibles, des ameliorations concretes, les competences manquantes probables pour ce profil, et un resume professionnel en 2-3 phrases.`;

    const schema = `{
  "score_total": 0,
  "ats_score": 0,
  "mise_en_page": 0,
  "lisibilite": 0,
  "impact": 0,
  "experience": 0,
  "competences": 0,
  "mots_cles": 0,
  "points_forts": [""],
  "points_faibles": [""],
  "ameliorations": [""],
  "competences_manquantes": [""],
  "resume": ""
}`;

    const result = await callGeminiJSON<AnalysisResult>(prompt, schema);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

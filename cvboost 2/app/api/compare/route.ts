import { NextRequest, NextResponse } from "next/server";
import { callGeminiJSON } from "@/lib/gemini";
import { ComparisonResult } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { cvText, jobOffer } = await req.json();
    if (!cvText || !jobOffer) {
      return NextResponse.json({ error: "cvText et jobOffer sont requis." }, { status: 400 });
    }

    const prompt = `Compare le CV suivant a l'offre d'emploi ci-dessous. Calcule un pourcentage de compatibilite realiste, liste les competences ou mots-cles manquants par rapport a l'offre, et propose des modifications concretes a apporter au CV pour cette candidature precise.

CV :
"""
${cvText}
"""

Offre d'emploi :
"""
${jobOffer}
"""`;

    const schema = `{
  "score_compatibilite": 0,
  "competences_manquantes": [""],
  "modifications_proposees": [""]
}`;

    const result = await callGeminiJSON<ComparisonResult>(prompt, schema);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

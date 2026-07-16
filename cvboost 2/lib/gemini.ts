// Ce fichier ne doit jamais etre importe depuis un composant client.
// La cle API reste exclusivement cote serveur (variable d'environnement GEMINI_API_KEY).

const GEMINI_MODEL = "gemini-2.0-flash";

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY n'est pas configuree. Ajoutez-la dans les variables d'environnement du projet."
    );
  }
  return key;
}

/**
 * Envoie un prompt a Gemini et force une reponse JSON stricte.
 * `schemaHint` est un exemple du format JSON attendu, injecte dans le prompt.
 */
export async function callGeminiJSON<T>(prompt: string, schemaHint: string): Promise<T> {
  const apiKey = getApiKey();

  const fullPrompt = `${prompt}

IMPORTANT : reponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni apres, sans balises markdown, suivant exactement cette structure :
${schemaHint}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erreur Gemini (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Reponse Gemini vide ou inattendue.");
  }

  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error("Impossible d'analyser la reponse JSON de Gemini.");
  }
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { createCV, getCurrentUser } from "@/lib/storage";

export default function NewCVPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'extraction.");
      setText(data.text);
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    const user = getCurrentUser();
    if (!user || !text.trim()) return;
    const cv = createCV(user.id, title || "Mon CV", text);
    router.push(`/dashboard/cv/${cv.id}`);
  }

  return (
    <DashboardShell>
      <h1 className="font-display text-3xl mb-1">Nouveau CV</h1>
      <p className="text-muted text-sm mb-8">
        Importez un fichier (PDF, DOCX, TXT) ou collez directement le texte de votre CV.
      </p>

      <div className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm text-muted mb-1.5" htmlFor="title">Titre du CV</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex. CV Data Analyst 2026"
            className="w-full bg-surface2 border border-line rounded-lg px-3.5 py-2.5 text-sm focus-ring"
          />
        </div>

        <div className="bg-surface border border-dashed border-line rounded-xl p-6">
          <label className="block text-sm font-medium mb-2">Importer un fichier</label>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFile}
            className="text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-signal file:text-white file:text-sm file:font-medium hover:file:bg-signal/90 file:cursor-pointer"
          />
          {loading && <p className="text-xs text-muted mt-2">Extraction du texte en cours...</p>}
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5" htmlFor="text">Ou collez le texte directement</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            placeholder="Collez ici le contenu de votre CV..."
            className="w-full bg-surface2 border border-line rounded-lg px-3.5 py-2.5 text-sm focus-ring font-mono"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          onClick={handleCreate}
          disabled={!text.trim()}
          className="bg-signal text-white px-6 py-2.5 rounded-full font-medium hover:bg-signal/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-ring"
        >
          Enregistrer et continuer
        </button>
      </div>
    </DashboardShell>
  );
}

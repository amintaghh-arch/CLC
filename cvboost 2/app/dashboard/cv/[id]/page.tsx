"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import {
  getCV,
  saveCV,
  getCurrentUser,
  spendCredits,
  logHistory,
} from "@/lib/storage";
import { CVEntry, User } from "@/lib/types";

const CREDIT_COSTS = {
  analyse: 1,
  optimisation: 1,
  comparaison: 1,
  lettre: 1,
};

type Tab = "analyse" | "optimisation" | "offre" | "lettre";

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-muted">{label}</span>
        <span className="font-mono text-[#E7E9EE]">{value}/100</span>
      </div>
      <div className="h-2 bg-surface2 rounded-full overflow-hidden">
        <div className="h-full bg-signal rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function CVDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [cv, setCv] = useState<CVEntry | null>(null);
  const [tab, setTab] = useState<Tab>("analyse");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [jobOffer, setJobOffer] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [tone, setTone] = useState("professionnel");

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);
    const found = getCV(id);
    if (!found || found.userId !== u.id) {
      router.push("/dashboard");
      return;
    }
    setCv(found);
  }, [id, router]);

  function requireCredits(type: keyof typeof CREDIT_COSTS): boolean {
    if (!user) return false;
    const ok = spendCredits(user.id, CREDIT_COSTS[type]);
    if (!ok) {
      router.push("/dashboard/billing");
      return false;
    }
    setUser(getCurrentUser());
    return true;
  }

  async function runAnalysis() {
    if (!cv || !user) return;
    if (!requireCredits("analyse")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: cv.rawText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const updated = { ...cv, analysis: data };
      saveCV(updated);
      setCv(updated);
      logHistory({ userId: user.id, cvId: cv.id, type: "analyse", creditsSpent: 1 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  async function runOptimization() {
    if (!cv || !user) return;
    if (!requireCredits("optimisation")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: cv.rawText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const updated = { ...cv, optimization: data };
      saveCV(updated);
      setCv(updated);
      logHistory({ userId: user.id, cvId: cv.id, type: "optimisation", creditsSpent: 1 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  async function runComparison() {
    if (!cv || !user || !jobOffer.trim()) return;
    if (!requireCredits("comparaison")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: cv.rawText, jobOffer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const updated = { ...cv, comparison: data };
      saveCV(updated);
      setCv(updated);
      logHistory({ userId: user.id, cvId: cv.id, type: "comparaison", creditsSpent: 1 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  async function generateLetter() {
    if (!cv || !user || !company.trim() || !position.trim()) return;
    if (!requireCredits("lettre")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: cv.rawText, company, position, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const updated = { ...cv, coverLetter: data.lettre };
      saveCV(updated);
      setCv(updated);
      logHistory({ userId: user.id, cvId: cv.id, type: "lettre", creditsSpent: 1 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  function exportText(content: string, filename: string) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!cv || !user) {
    return (
      <DashboardShell>
        <p className="text-muted text-sm">Chargement...</p>
      </DashboardShell>
    );
  }

  const isFree = user.plan === "free";

  return (
    <DashboardShell>
      <h1 className="font-display text-3xl mb-1">{cv.title}</h1>
      <p className="text-muted text-sm mb-8">
        Cree le {new Date(cv.createdAt).toLocaleDateString("fr-FR")}
      </p>

      <div className="flex gap-2 mb-8 border-b border-line overflow-x-auto">
        {([
          ["analyse", "Analyse"],
          ["optimisation", "Optimisation"],
          ["offre", "Adapter a une offre"],
          ["lettre", "Lettre de motivation"],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === key ? "border-signal text-[#E7E9EE]" : "border-transparent text-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-500/30 text-red-300 text-sm rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {tab === "analyse" && (
        <div>
          {!cv.analysis ? (
            <button
              onClick={runAnalysis}
              disabled={loading}
              className="bg-signal text-white px-6 py-2.5 rounded-full font-medium hover:bg-signal/90 disabled:opacity-50 transition-colors focus-ring"
            >
              {loading ? "Analyse en cours..." : "Analyser mon CV (1 credit)"}
            </button>
          ) : (
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-surface border border-line rounded-xl p-6 text-center">
                  <p className="text-xs text-muted mb-2">Score global</p>
                  <p className="font-display text-5xl text-signal">{cv.analysis.score_total}</p>
                </div>
                <div className="bg-surface border border-line rounded-xl p-6 text-center">
                  <p className="text-xs text-muted mb-2">Score ATS</p>
                  <p className="font-display text-5xl">{cv.analysis.ats_score}</p>
                </div>
              </div>

              <div className="bg-surface border border-line rounded-xl p-6 space-y-4">
                <ScoreBar label="Mise en page" value={cv.analysis.mise_en_page} />
                <ScoreBar label="Lisibilite" value={cv.analysis.lisibilite} />
                <ScoreBar label="Impact" value={cv.analysis.impact} />
                <ScoreBar label="Experience" value={cv.analysis.experience} />
                <ScoreBar label="Competences" value={cv.analysis.competences} />
                <ScoreBar label="Mots-cles" value={cv.analysis.mots_cles} />
              </div>

              <p className="text-sm text-[#E7E9EE] leading-relaxed bg-surface border border-line rounded-xl p-6">
                {cv.analysis.resume}
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3 text-signal">Points forts</h3>
                  <ul className="space-y-2 text-sm text-muted">
                    {cv.analysis.points_forts.map((p, i) => <li key={i}>• {p}</li>)}
                  </ul>
                </div>
                <div className={isFree ? "relative" : ""}>
                  <h3 className="font-medium mb-3">Points faibles</h3>
                  <ul className={`space-y-2 text-sm text-muted ${isFree ? "blur-sm select-none" : ""}`}>
                    {cv.analysis.points_faibles.map((p, i) => <li key={i}>• {p}</li>)}
                  </ul>
                  {isFree && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <a href="/dashboard/billing" className="text-xs bg-signal text-white px-3 py-1.5 rounded-full">
                        Debloquer en Premium
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Ameliorations suggerees</h3>
                <ul className="space-y-2 text-sm text-muted">
                  {cv.analysis.ameliorations.map((p, i) => <li key={i}>• {p}</li>)}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-3">Competences manquantes probables</h3>
                <div className="flex flex-wrap gap-2">
                  {cv.analysis.competences_manquantes.map((c, i) => (
                    <span key={i} className="text-xs font-mono bg-surface2 border border-line rounded-full px-3 py-1">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={runAnalysis}
                disabled={loading}
                className="text-sm text-muted hover:text-[#E7E9EE] underline"
              >
                Relancer l&apos;analyse (1 credit)
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "optimisation" && (
        <div>
          {!cv.optimization ? (
            <button
              onClick={runOptimization}
              disabled={loading}
              className="bg-signal text-white px-6 py-2.5 rounded-full font-medium hover:bg-signal/90 disabled:opacity-50 transition-colors focus-ring"
            >
              {loading ? "Optimisation en cours..." : "Optimiser mon CV (1 credit)"}
            </button>
          ) : (
            <div className="space-y-6">
              <div className="bg-surface border border-line rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Version amelioree</h3>
                  <button
                    onClick={() => exportText(cv.optimization!.version_amelioree, `${cv.title}-optimise.txt`)}
                    className="text-xs text-signal hover:underline"
                  >
                    Exporter (.txt)
                  </button>
                </div>
                <p className="text-sm text-[#E7E9EE] whitespace-pre-wrap leading-relaxed font-mono">
                  {cv.optimization.version_amelioree}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-3">Changements effectues</h3>
                <ul className="space-y-2 text-sm text-muted">
                  {cv.optimization.changements_effectues.map((c, i) => <li key={i}>• {c}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Explications</h3>
                <ul className="space-y-2 text-sm text-muted">
                  {cv.optimization.explications.map((c, i) => <li key={i}>• {c}</li>)}
                </ul>
              </div>
              <button
                onClick={runOptimization}
                disabled={loading}
                className="text-sm text-muted hover:text-[#E7E9EE] underline"
              >
                Relancer l&apos;optimisation (1 credit)
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "offre" && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm text-muted mb-1.5">Texte de l&apos;offre d&apos;emploi</label>
            <textarea
              value={jobOffer}
              onChange={(e) => setJobOffer(e.target.value)}
              rows={8}
              placeholder="Collez ici le texte de l'offre d'emploi..."
              className="w-full bg-surface2 border border-line rounded-lg px-3.5 py-2.5 text-sm focus-ring font-mono"
            />
          </div>
          <button
            onClick={runComparison}
            disabled={loading || !jobOffer.trim()}
            className="bg-signal text-white px-6 py-2.5 rounded-full font-medium hover:bg-signal/90 disabled:opacity-50 transition-colors focus-ring"
          >
            {loading ? "Comparaison en cours..." : "Comparer a cette offre (1 credit)"}
          </button>

          {cv.comparison && (
            <div className="space-y-6 pt-4">
              <div className="bg-surface border border-line rounded-xl p-6 text-center">
                <p className="text-xs text-muted mb-2">Compatibilite avec l&apos;offre</p>
                <p className="font-display text-5xl text-signal">{cv.comparison.score_compatibilite}%</p>
              </div>
              <div>
                <h3 className="font-medium mb-3">Competences manquantes</h3>
                <div className="flex flex-wrap gap-2">
                  {cv.comparison.competences_manquantes.map((c, i) => (
                    <span key={i} className="text-xs font-mono bg-surface2 border border-line rounded-full px-3 py-1">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Modifications proposees</h3>
                <ul className="space-y-2 text-sm text-muted">
                  {cv.comparison.modifications_proposees.map((c, i) => <li key={i}>• {c}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "lettre" && (
        <div className="space-y-6 max-w-2xl">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1.5">Entreprise</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-surface2 border border-line rounded-lg px-3.5 py-2.5 text-sm focus-ring"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5">Poste</label>
              <input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full bg-surface2 border border-line rounded-lg px-3.5 py-2.5 text-sm focus-ring"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Ton souhaite</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-surface2 border border-line rounded-lg px-3.5 py-2.5 text-sm focus-ring"
            >
              <option value="professionnel">Professionnel</option>
              <option value="chaleureux">Chaleureux</option>
              <option value="direct">Direct et concis</option>
              <option value="creatif">Creatif</option>
            </select>
          </div>
          <button
            onClick={generateLetter}
            disabled={loading || !company.trim() || !position.trim()}
            className="bg-signal text-white px-6 py-2.5 rounded-full font-medium hover:bg-signal/90 disabled:opacity-50 transition-colors focus-ring"
          >
            {loading ? "Generation en cours..." : "Generer la lettre (1 credit)"}
          </button>

          {cv.coverLetter && (
            <div className="bg-surface border border-line rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Lettre generee</h3>
                <button
                  onClick={() => exportText(cv.coverLetter!, `lettre-${company || "motivation"}.txt`)}
                  className="text-xs text-signal hover:underline"
                >
                  Exporter (.txt)
                </button>
              </div>
              <p className="text-sm text-[#E7E9EE] whitespace-pre-wrap leading-relaxed">{cv.coverLetter}</p>
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}

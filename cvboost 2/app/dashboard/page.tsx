"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getCurrentUser, getCVs, getHistory } from "@/lib/storage";
import { CVEntry, HistoryEvent, User } from "@/lib/types";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [cvs, setCvs] = useState<CVEntry[]>([]);
  const [history, setHistory] = useState<HistoryEvent[]>([]);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) return;
    setUser(u);
    setCvs(getCVs(u.id));
    setHistory(getHistory(u.id));
  }, []);

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl mb-1">Tableau de bord</h1>
          <p className="text-muted text-sm">{user?.email}</p>
        </div>
        <Link
          href="/dashboard/new"
          className="bg-signal text-white px-5 py-2.5 rounded-full font-medium hover:bg-signal/90 transition-colors focus-ring"
        >
          Creer un nouveau CV
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-surface border border-line rounded-xl p-5">
          <p className="text-xs text-muted mb-1">CV enregistres</p>
          <p className="font-display text-3xl">{cvs.length}</p>
        </div>
        <div className="bg-surface border border-line rounded-xl p-5">
          <p className="text-xs text-muted mb-1">Analyses effectuees</p>
          <p className="font-display text-3xl">{history.filter((h) => h.type === "analyse").length}</p>
        </div>
        <div className="bg-surface border border-line rounded-xl p-5">
          <p className="text-xs text-muted mb-1">Abonnement</p>
          <p className="font-display text-3xl capitalize">{user?.plan ?? "-"}</p>
        </div>
      </div>

      <h2 className="font-display text-xl mb-4">Vos CV</h2>
      {cvs.length === 0 ? (
        <div className="bg-surface border border-dashed border-line rounded-xl p-10 text-center text-muted text-sm">
          Aucun CV pour le moment. Creez-en un pour lancer votre premiere analyse.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cvs
            .slice()
            .reverse()
            .map((cv) => (
              <Link
                key={cv.id}
                href={`/dashboard/cv/${cv.id}`}
                className="bg-surface border border-line rounded-xl p-5 hover:border-signal/50 transition-colors"
              >
                <h3 className="font-medium mb-1 truncate">{cv.title}</h3>
                <p className="text-xs text-muted mb-3">
                  {new Date(cv.createdAt).toLocaleDateString("fr-FR")}
                </p>
                {cv.analysis ? (
                  <span className="font-mono text-xs text-signal">
                    Score {cv.analysis.score_total}/100
                  </span>
                ) : (
                  <span className="font-mono text-xs text-muted">Pas encore analyse</span>
                )}
              </Link>
            ))}
        </div>
      )}
    </DashboardShell>
  );
}

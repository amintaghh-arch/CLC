"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminStats } from "@/lib/storage";
import { User } from "@/lib/types";

export default function AdminPage() {
  const [stats, setStats] = useState<ReturnType<typeof getAdminStats> | null>(null);

  useEffect(() => {
    setStats(getAdminStats());
  }, []);

  if (!stats) {
    return <div className="min-h-screen flex items-center justify-center text-muted text-sm">Chargement...</div>;
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="font-display text-lg">
            CVBoost <span className="text-signal">AI</span> <span className="text-muted text-sm">/ Admin</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl mb-8">Administration</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Utilisateurs" value={stats.totalUsers} />
          <StatCard label="Abonnes Premium (simule)" value={stats.premiumUsers} />
          <StatCard label="CV enregistres" value={stats.totalCVs} />
          <StatCard label="Analyses" value={stats.totalAnalyses} />
          <StatCard label="Optimisations" value={stats.totalOptimizations} />
          <StatCard label="Lettres generees" value={stats.totalLetters} />
        </div>

        <h2 className="font-display text-xl mb-4">Utilisateurs</h2>
        <div className="bg-surface border border-line rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-line">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Credits</th>
                <th className="px-4 py-3 font-medium">Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {stats.users.map((u: User) => (
                <tr key={u.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.plan}</td>
                  <td className="px-4 py-3 font-mono">{u.plan === "premium" ? "illimite" : u.credits}</td>
                  <td className="px-4 py-3 text-muted">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
              {stats.users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted">Aucun utilisateur.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted font-mono mt-6">
          Note : cet espace admin lit les donnees stockees localement (demo/MVP). En production,
          protegez cette route par une authentification dediee.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-surface border border-line rounded-xl p-5">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="font-display text-3xl">{value}</p>
    </div>
  );
}

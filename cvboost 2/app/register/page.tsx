"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/storage";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      registerUser(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-xl block text-center mb-8">
          CVBoost <span className="text-signal">AI</span>
        </Link>
        <div className="bg-surface border border-line rounded-xl p-8">
          <h1 className="font-display text-2xl mb-1">Creer un compte</h1>
          <p className="text-muted text-sm mb-6">5 credits gratuits a l'inscription.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface2 border border-line rounded-lg px-3.5 py-2.5 text-sm focus-ring"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5" htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface2 border border-line rounded-lg px-3.5 py-2.5 text-sm focus-ring"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              className="w-full bg-signal text-white rounded-full py-2.5 font-medium hover:bg-signal/90 transition-colors focus-ring"
            >
              Creer mon compte
            </button>
          </form>

          <p className="text-sm text-muted mt-6 text-center">
            Deja un compte ?{" "}
            <Link href="/login" className="text-signal hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

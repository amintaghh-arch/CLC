"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-xl block text-center mb-8">
          CVBoost <span className="text-signal">AI</span>
        </Link>
        <div className="bg-surface border border-line rounded-xl p-8">
          <h1 className="font-display text-2xl mb-1">Mot de passe oublie</h1>
          <p className="text-muted text-sm mb-6">
            Entrez votre email, nous vous enverrons un lien de reinitialisation.
          </p>

          {sent ? (
            <p className="text-sm bg-signal/10 border border-signal/30 rounded-lg p-4 text-[#E7E9EE]">
              Si un compte existe pour {email}, un email de reinitialisation vient d&apos;etre envoye.
            </p>
          ) : (
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
              <button
                type="submit"
                className="w-full bg-signal text-white rounded-full py-2.5 font-medium hover:bg-signal/90 transition-colors focus-ring"
              >
                Envoyer le lien
              </button>
            </form>
          )}

          <p className="text-sm text-muted mt-6 text-center">
            <Link href="/login" className="text-signal hover:underline">Retour a la connexion</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

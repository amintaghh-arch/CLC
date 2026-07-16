"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { addCredits, getCurrentUser, updateUser } from "@/lib/storage";

const PACKS = [
  { id: "pack5", price: "5€", credits: 20 },
  { id: "pack10", price: "10€", credits: 50 },
];

export default function BillingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setStatus("processing");
    setTimeout(() => {
      const user = getCurrentUser();
      const pack = PACKS.find((p) => p.id === selected);
      if (user && pack) {
        addCredits(user.id, pack.credits);
      }
      setStatus("success");
    }, 1500);
  }

  function goPremium() {
    const user = getCurrentUser();
    if (!user) return;
    updateUser(user.id, { plan: "premium" });
    router.push("/dashboard");
  }

  return (
    <DashboardShell>
      <h1 className="font-display text-3xl mb-1">Recharger des credits</h1>
      <p className="text-muted text-sm mb-2">
        Simulation de paiement — aucune transaction reelle n&apos;est effectuee, aucune donnee
        bancaire n&apos;est enregistree.
      </p>
      <p className="text-xs text-muted font-mono mb-8">Aucune connexion a Stripe ou a un prestataire reel.</p>

      {status === "success" ? (
        <div className="bg-signal/10 border border-signal/30 rounded-xl p-8 text-center max-w-md">
          <p className="text-2xl mb-2">✓</p>
          <p className="font-medium mb-1">Paiement simule reussi</p>
          <p className="text-sm text-muted mb-6">Vos credits ont ete ajoutes a votre compte.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-signal text-white px-6 py-2.5 rounded-full font-medium hover:bg-signal/90 transition-colors focus-ring"
          >
            Retour au tableau de bord
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
          <div className="space-y-4">
            <h2 className="font-medium mb-2">1. Choisissez un pack</h2>
            {PACKS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`w-full text-left border rounded-xl p-4 transition-colors ${
                  selected === p.id ? "border-signal bg-signal/10" : "border-line bg-surface"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{p.credits} credits</span>
                  <span className="font-display text-xl">{p.price}</span>
                </div>
              </button>
            ))}

            <div className="pt-4 border-t border-line">
              <h2 className="font-medium mb-2">Ou passez Premium</h2>
              <p className="text-sm text-muted mb-3">Analyses et generations illimitees, sans gerer de credits.</p>
              <button
                onClick={goPremium}
                className="border border-signal text-signal px-5 py-2.5 rounded-full font-medium hover:bg-signal/10 transition-colors focus-ring"
              >
                Passer Premium (simulation)
              </button>
            </div>
          </div>

          <form onSubmit={handlePay} className="bg-surface border border-line rounded-xl p-6 space-y-4 h-fit">
            <h2 className="font-medium mb-2">2. Paiement (simulation)</h2>
            <div>
              <label className="block text-sm text-muted mb-1.5">Numero de carte</label>
              <input
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                className="w-full bg-surface2 border border-line rounded-lg px-3.5 py-2.5 text-sm font-mono focus-ring"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5">Nom du titulaire</label>
              <input
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full bg-surface2 border border-line rounded-lg px-3.5 py-2.5 text-sm focus-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-1.5">Expiration</label>
                <input
                  required
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/AA"
                  maxLength={5}
                  className="w-full bg-surface2 border border-line rounded-lg px-3.5 py-2.5 text-sm font-mono focus-ring"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1.5">CVV</label>
                <input
                  required
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  maxLength={3}
                  className="w-full bg-surface2 border border-line rounded-lg px-3.5 py-2.5 text-sm font-mono focus-ring"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!selected || status === "processing"}
              className="w-full bg-signal text-white rounded-full py-2.5 font-medium hover:bg-signal/90 disabled:opacity-50 transition-colors focus-ring"
            >
              {status === "processing" ? "Traitement en cours..." : "Payer"}
            </button>
          </form>
        </div>
      )}
    </DashboardShell>
  );
}

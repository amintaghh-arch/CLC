"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Comment fonctionne l'analyse IA ?",
    a: "Vous importez votre CV (PDF, DOCX ou texte colle). Notre IA l'analyse et calcule plusieurs scores : ATS, mise en page, lisibilite, impact, competences et mots-cles.",
  },
  {
    q: "Mes donnees sont-elles conservees ?",
    a: "Vos CV et l'historique de vos analyses restent lies a votre compte, afin de pouvoir suivre vos progres et revenir sur une version precedente.",
  },
  {
    q: "Que se passe-t-il quand mes credits sont epuises ?",
    a: "Les fonctions IA sont temporairement bloquees et une page de recharge s'affiche. Vous pouvez recharger des credits ou passer en Premium pour un usage illimite.",
  },
  {
    q: "Puis-je adapter mon CV a une offre precise ?",
    a: "Oui. Collez le texte de l'offre et l'IA calcule un pourcentage de compatibilite, liste les competences manquantes et propose des modifications cibl\u00e9es.",
  },
  {
    q: "Le paiement est-il reel ?",
    a: "Non, il s'agit d'une demonstration. Aucune transaction reelle n'est effectuee et aucune donnee bancaire n'est enregistree.",
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto divide-y divide-line border-t border-b border-line">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left focus-ring"
              aria-expanded={isOpen}
            >
              <span className="font-medium">{item.q}</span>
              <span className="text-signal font-mono text-lg leading-none">
                {isOpen ? "\u2212" : "+"}
              </span>
            </button>
            {isOpen && (
              <p className="text-sm text-muted leading-relaxed pb-5 pr-8">{item.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

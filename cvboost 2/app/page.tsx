import Link from "next/link";
import CVMockup from "@/components/landing/CVMockup";
import FAQAccordion from "@/components/landing/FAQAccordion";

const FEATURES = [
  { label: "Analyse ATS", text: "Un score de compatibilite avec les logiciels de tri automatique, calcule ligne par ligne." },
  { label: "Reecriture IA", text: "Verbes d'action, vocabulaire professionnel, suppression des repetitions - en un clic." },
  { label: "Adaptation par offre", text: "Collez une offre d'emploi, obtenez un pourcentage de compatibilite et les ecarts a combler." },
  { label: "Lettre de motivation", text: "Generee automatiquement a partir de votre profil, du poste et du ton souhaite." },
  { label: "Historique complet", text: "Chaque version, chaque analyse, chaque optimisation reste accessible." },
  { label: "Export PDF / DOCX", text: "Telechargez votre CV corrige dans le format dont vous avez besoin." },
];

const TESTIMONIALS = [
  { name: "Lea M.", role: "Recherche en marketing digital", quote: "Le score ATS m'a fait comprendre pourquoi mes candidatures restaient sans reponse. Corrige en une soiree." },
  { name: "Karim B.", role: "Reconversion vers la data", quote: "L'adaptation a l'offre m'a montre exactement les mots-cles qu'il manquait a mon profil." },
  { name: "Sophie D.", role: "Jeune diplomee", quote: "La lettre de motivation generee m'a servi de base solide, je n'ai eu qu'a l'ajuster." },
];

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden">
      {/* NAV */}
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <span className="font-display text-xl tracking-tight">CVBoost <span className="text-signal">AI</span></span>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/login" className="text-muted hover:text-[#E7E9EE] transition-colors hidden sm:inline">Se connecter</Link>
          <Link href="/register" className="bg-signal text-white px-4 py-2 rounded-full font-medium hover:bg-signal/90 transition-colors focus-ring">
            Essayer gratuitement
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-signal border border-signal/40 rounded-full px-3 py-1 mb-6">
            Analyse IA en temps reel
          </span>
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] mb-6">
            Votre CV, <span className="italic text-signal">corrige</span> comme par un recruteur exigeant.
          </h1>
          <p className="text-muted text-lg leading-relaxed mb-8 max-w-lg">
            Importez votre CV, obtenez un score ATS precis, et laissez l'IA reecrire chaque phrase faible en une version qui passe les filtres et retient l'attention.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/register" className="bg-signal text-white px-6 py-3.5 rounded-full font-medium hover:bg-signal/90 transition-colors focus-ring">
              Essayer gratuitement
            </Link>
            <Link href="#fonctionnalites" className="border border-line px-6 py-3.5 rounded-full font-medium text-muted hover:text-[#E7E9EE] hover:border-muted transition-colors focus-ring">
              Voir les fonctionnalites
            </Link>
          </div>
          <p className="text-xs text-muted mt-4 font-mono">5 analyses gratuites - aucune carte requise</p>
        </div>
        <CVMockup />
      </section>

      {/* FEATURES */}
      <section id="fonctionnalites" className="max-w-6xl mx-auto px-6 py-20 border-t border-line">
        <h2 className="font-display text-3xl mb-2">Ce que l'IA verifie a votre place</h2>
        <p className="text-muted mb-12 max-w-xl">Chaque fonctionnalite reproduit un reflexe de recruteur ou d'expert RH, applique en quelques secondes.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.label} className="bg-surface border border-line rounded-xl p-6 hover:border-signal/50 transition-colors">
              <h3 className="font-medium mb-2">{f.label}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO / SCORES */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-line">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl mb-4">Des scores clairs, pas une note mysterieuse</h2>
            <p className="text-muted leading-relaxed mb-6">
              Mise en page, lisibilite, impact, experience, competences, mots-cles - chaque dimension a son propre score, pour savoir exactement quoi corriger en premier.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { label: "Score ATS", value: 87 },
              { label: "Impact", value: 72 },
              { label: "Mots-cles", value: 64 },
              { label: "Mise en page", value: 91 },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted">{s.label}</span>
                  <span className="font-mono text-[#E7E9EE]">{s.value}/100</span>
                </div>
                <div className="h-2 bg-surface2 rounded-full overflow-hidden">
                  <div className="h-full bg-signal rounded-full" style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-line">
        <h2 className="font-display text-3xl mb-12">Ils ont corrige leur CV</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-surface border border-line rounded-xl p-6">
              <p className="text-sm leading-relaxed mb-4 text-[#E7E9EE]">&laquo; {t.quote} &raquo;</p>
              <div className="text-sm">
                <span className="font-medium">{t.name}</span>
                <span className="text-muted"> - {t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" className="max-w-6xl mx-auto px-6 py-20 border-t border-line">
        <h2 className="font-display text-3xl mb-12 text-center">Simple, sans surprise</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="border border-line rounded-xl p-8">
            <h3 className="font-medium text-lg mb-1">Gratuit</h3>
            <p className="text-3xl font-display mb-4">0€</p>
            <ul className="text-sm text-muted space-y-2 mb-6">
              <li>5 credits a l'inscription</li>
              <li>Score ATS complet</li>
              <li>Recommandations partielles</li>
            </ul>
            <Link href="/register" className="block text-center border border-line rounded-full py-2.5 hover:border-muted transition-colors">Commencer</Link>
          </div>
          <div className="border-2 border-signal rounded-xl p-8 relative">
            <span className="absolute -top-3 left-8 bg-signal text-white text-xs font-mono px-3 py-1 rounded-full">Populaire</span>
            <h3 className="font-medium text-lg mb-1">Premium</h3>
            <p className="text-3xl font-display mb-4">5€ <span className="text-sm text-muted font-body">/ 20 credits</span></p>
            <ul className="text-sm text-muted space-y-2 mb-6">
              <li>Analyses illimitees</li>
              <li>Optimisation complete</li>
              <li>Adaptation aux offres d'emploi</li>
              <li>Lettres de motivation illimitees</li>
            </ul>
            <Link href="/register" className="block text-center bg-signal text-white rounded-full py-2.5 hover:bg-signal/90 transition-colors">Passer Premium</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-line">
        <h2 className="font-display text-3xl mb-12 text-center">Questions frequentes</h2>
        <FAQAccordion />
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-12 grid sm:grid-cols-3 gap-8 text-sm">
          <div>
            <span className="font-display text-lg">CVBoost <span className="text-signal">AI</span></span>
            <p className="text-muted mt-3 leading-relaxed">Votre CV, analyse et corrige par l'intelligence artificielle.</p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Produit</h4>
            <ul className="text-muted space-y-2">
              <li><Link href="#fonctionnalites" className="hover:text-[#E7E9EE]">Fonctionnalites</Link></li>
              <li><Link href="#tarifs" className="hover:text-[#E7E9EE]">Tarifs</Link></li>
              <li><Link href="/register" className="hover:text-[#E7E9EE]">Essayer gratuitement</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Compte</h4>
            <ul className="text-muted space-y-2">
              <li><Link href="/login" className="hover:text-[#E7E9EE]">Connexion</Link></li>
              <li><Link href="/reset-password" className="hover:text-[#E7E9EE]">Mot de passe oublie</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-8 text-xs text-muted font-mono">
          © {new Date().getFullYear()} CVBoost AI - Projet de demonstration.
        </div>
      </footer>
    </main>
  );
}

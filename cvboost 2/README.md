# CVBoost AI

SaaS de demonstration : analyse et optimisation de CV par IA (Gemini), Next.js 14 (App Router), TypeScript, Tailwind CSS.

## Demarrage local

```bash
npm install
cp .env.example .env.local   # puis collez votre cle dans .env.local
npm run dev
```

## Deploiement sur Vercel

1. Poussez ce dossier vers un repo GitHub (racine du repo = racine du projet Next.js,
   c'est-a-dire que `package.json` doit etre a la racine du repo, pas dans un sous-dossier).
2. Sur vercel.com : "Add New Project" → importez le repo.
3. Vercel detecte automatiquement Next.js. Ne changez pas les commandes de build.
4. Dans **Settings → Environment Variables**, ajoutez :
   - `GEMINI_API_KEY` = votre cle API Gemini (https://aistudio.google.com/apikey)
5. Deployez. La route `/` doit maintenant afficher la landing page.

## Notes MVP

- Authentification, credits, historique et CV sont stockes en `localStorage` (pas de base de
  donnees externe) — suffisant pour une demo, a remplacer par une vraie base + auth pour la prod.
- Le paiement est entierement simule : aucune connexion Stripe, aucune donnee bancaire stockee.
- Toutes les requetes IA passent par des routes API serveur (`app/api/*`) : la cle Gemini n'est
  jamais exposee au navigateur.

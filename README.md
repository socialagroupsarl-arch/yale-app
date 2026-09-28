# YALE — Espace Participant (Web/PWA)

Reproduction de l'appli YALE ("On se retrouve là") en React + Supabase, en commençant par l'espace **Participant**.

## Stack
- React 18 + Vite + React Router
- Supabase (Postgres, Auth, RLS) — projet `Yale`
- PWA (vite-plugin-pwa)

## Écrans inclus
- Connexion / Choix du type de compte / Inscription Participant / Vérification e-mail (OTP)
- Accueil (catégories, événements en vedette, organisateurs, cagnottes)
- Mes billets (à venir / passés / annulés)
- Notifications (par catégorie)
- Mes favoris (événements / cagnottes)
- Mon portefeuille (solde, recharge/retrait, transactions)
- Mon compte (infos, sécurité, menu, déconnexion)

## Installation

```bash
npm install
cp .env.example .env
# renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env
npm run dev
```

## Base de données

Le schéma (tables `profiles`, `events`, `tickets`, `cagnottes`, `wallets`, `notifications`, etc.) est déjà déployé sur le projet Supabase **Yale**, avec RLS activée (chaque utilisateur ne voit que ses propres billets/favoris/notifications/portefeuille).

⚠️ Pour que la vérification par **code à 6 chiffres** fonctionne (au lieu d'un lien de confirmation), il faut activer le template "Confirm signup" en mode OTP dans Supabase :
**Dashboard → Authentication → Email Templates → Confirm signup** → utiliser `{{ .Token }}` dans le corps du message.

## À venir
- Espace Organisateur (création d'événements, gestion des ventes)
- Paiement / recharge du portefeuille (Mobile Money)
- Upload des visuels d'événements et de cagnottes

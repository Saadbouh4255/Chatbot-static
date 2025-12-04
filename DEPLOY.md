# 🚀 Guide de Déploiement sur Render

Ce guide vous explique comment déployer Coulouche-Bot sur Render.com.

## Prérequis

1. Un compte sur [Render.com](https://render.com)
2. Le code poussé sur un dépôt GitHub ou GitLab

## Configuration Automatique (Recommandé)

Le projet contient un fichier `render.yaml` qui configure automatiquement les services.

1. Allez sur le [Dashboard Render](https://dashboard.render.com/)
2. Cliquez sur **New +** et sélectionnez **Blueprint**
3. Connectez votre dépôt GitHub/GitLab
4. Render va détecter le fichier `render.yaml` et proposer de créer deux services :
   - `coulouche-bot-backend` (Web Service)
   - `coulouche-bot-frontend` (Static Site)
5. Cliquez sur **Apply**

## Configuration des Variables d'Environnement

Une fois les services créés, vous devez configurer quelques variables importantes :

### Backend (`coulouche-bot-backend`)

Allez dans l'onglet **Environment** du service backend et ajoutez/vérifiez :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `CLE_API` | `votre_clé_gemini` | **Requis** : Votre clé API Google Gemini |
| `SECRET_KEY` | (Généré auto) | Clé secrète Django |
| `DEBUG` | `False` | Désactive le mode debug |
| `ALLOWED_HOSTS` | `coulouche-bot-backend.onrender.com` | Domaine du backend |
| `CORS_ALLOWED_ORIGINS` | `https://coulouche-bot-frontend.onrender.com` | URL du frontend (à mettre à jour après déploiement) |

### Frontend (`coulouche-bot-frontend`)

Allez dans l'onglet **Environment** du service frontend :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `REACT_APP_API_URL` | `https://coulouche-bot-backend.onrender.com/api/chat/message/` | URL de l'API backend |

⚠️ **Important** : Si l'URL de votre backend est différente (par exemple si Render ajoute un suffixe), mettez à jour `REACT_APP_API_URL` dans le frontend et `CORS_ALLOWED_ORIGINS` dans le backend.

## Vérification

1. Le backend doit répondre "Not Found" sur la racine `/` (c'est normal) mais `/admin` doit fonctionner.
2. Le frontend doit s'afficher et pouvoir envoyer des messages.

## Dépannage

- **Erreur CORS** : Vérifiez que l'URL du frontend est bien dans `CORS_ALLOWED_ORIGINS` du backend (sans slash à la fin).
- **Erreur 500** : Vérifiez les logs du backend. Souvent lié à la `CLE_API` manquante ou invalide.
- **Build échoué** : Vérifiez les logs de build. Assurez-vous que `requirements.txt` et `package.json` sont à jour.

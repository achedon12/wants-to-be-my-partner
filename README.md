# Qui Veut Être Mon Associé - API

API pour matcher entrepreneurs et investisseurs. Les entrepreneurs postent leurs projets, les investisseurs les financent.

## Fonctionnalités

**Authentification**
- Inscription / Login avec JWT
- 3 rôles : Entrepreneur, Investisseur, Admin

**Utilisateurs**
- Profil et modification des infos
- Gestion des intérêts/préférences
- Liste de tous les users (Admin)

**Projets**
- Les entrepreneurs créent des projets
- Les autres peuvent consulter et investir
- Seul le créateur ou un admin peuvent modifier/supprimer
- Recommandations basées sur les intérêts

**Investissements**
- Les investisseurs mettent de l'argent sur les projets
- Chacun voit ses investissements
- Admin voit tout
- Possibilité d'annuler

**Intérêts**
- Liste d'intérêts publique
- Les users peuvent en associer à leur profil
- Sert pour les recommandations de projets

## Installation

Faut avoir Node.js 16+, npm, et MySQL.

```bash
# Cloner et installer
git clone https://github.com/achedon12/wants-to-be-my-partner.git
cd wants-to-be-my-partner
npm install

# Copier le .env.example en .env et remplir les infos de la DB
cp .env.example .env
```

## Démarrage

```bash
docker compose -f "docker-compose.dev.yml" up -d # Lancer la DB en dev

npm run start:dev    # Dev avec auto-reload
npm run start:prod   # Prod
npm run build        # Juste compiler
```

L'API démarre sur `http://localhost:3000`

## API Docs

Swagger est disponible à : `http://localhost:3000/api/docs`

Tous les endpoints sont documentés avec les réponses, les erreurs, et ce qu'il faut envoyer.

## Routes principales

### Auth
- `POST /api/auth/register` - S'inscrire
- `POST /api/auth/login` - Se connecter (retourne un JWT)

### Users
- `GET /api/user/profile` - Mon profil (besoin JWT)
- `PUT /api/user/profile` - Modifier mon profil
- `POST /api/user/interests` - Ajouter mes intérêts
- `GET /api/user/interests` - Voir mes intérêts
- `GET /api/user/list` - Voir tous les users (admin seulement)
- `DELETE /api/user/:id` - Supprimer un user (admin seulement)

### Projects
- `POST /api/project` - Créer un projet (entrepreneur seulement)
- `GET /api/project/list` - Voir les projets (besoin JWT)
- `GET /api/project/recommended` - Projets recommandés pour moi
- `GET /api/project/:id` - Détails d'un projet
- `PUT /api/project/:id` - Modifier mon projet
- `DELETE /api/project/:id` - Supprimer mon projet

### Interests
- `GET /api/interest` - Tous les intérêts (public)
- `POST /api/interest` - Créer un intérêt (admin)
- `PATCH /api/interest/:id` - Modifier (admin)
- `DELETE /api/interest/:id` - Supprimer (admin)

### Investments
- `POST /api/investment` - Investir dans un projet (investisseur)
- `GET /api/investment` - Voir mes investissements
- `GET /api/investment/project/:id` - Investisseurs d'un projet
- `DELETE /api/investment/:id` - Annuler mon investissement

## Utiliser l'API

Pour les routes qui demandent JWT, inclure le header :
```
Authorization: Bearer <votre_token>
```

## Rôles

**Entrepreneur** : crée des projets, voit les autres projets, les investisseurs de ses projets

**Investisseur** : voit les projets, investit dedans, annule ses investissements

**Admin** : accès à tout, peut supprimer n'importe quoi, voir tous les investissements

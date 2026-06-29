# 📚 Library Management System

Système complet de gestion de bibliothèque avec architecture professionnelle.

## 🏗️ Stack Technique

| Composant | Technologies |
|-----------|--------------|
| **Backend** | Node.js, Express, MySQL, Winston, Jest, Supertest |
| **Frontend** | React, Vite, CSS Vanilla |
| **Qualité** | ESLint, Prettier, Husky |
| **Tests** | Jest, Supertest |
| **Conteneurisation** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |

## 📦 Installation

### Prérequis
- Node.js 18+
- MySQL 8.0+
 

### Installation standard

```bash
# Cloner le projet
git clone https://github.com/tdelminot/library-management.git
cd library-management

# Installer les dépendances
npm run install:all

# Copier les variables d'environnement
cp .env.example .env

# Configurer .env avec vos identifiants MySQL

# Démarrer l'application
npm run dev
Avec Docker
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
 
🚀 Utilisation
Frontend: http://localhost:3000

Backend API: http://localhost:3001

Health Check: http://localhost:3001/health

🧪 Tests
bash
# Tests backend
cd backend && npm test

# Tests avec couverture
cd backend && npm run test:coverage

# Tests en watch mode
cd backend && npm run test:watch
📚 API Documentation
Endpoints
Méthode	Endpoint	Description
GET	/api/books	Liste des livres
GET	/api/books/stats	Statistiques
GET	/api/books/:id	Détail d'un livre
POST	/api/books	Créer un livre
PUT	/api/books/:id	Modifier un livre
DELETE	/api/books/:id	Supprimer un livre
POST	/api/books/:id/borrow	Emprunter
POST	/api/books/:id/return	Retourner
Exemple de requête
bash
# Créer un livre
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "published_year": 2008,
    "genre": "Technology"
  }'

# Emprunter un livre
curl -X POST http://localhost:3001/api/books/1/borrow

# Lister les livres
curl http://localhost:3001/api/books
📊 Structure du Projet
text
library-management/
├── backend/
│   ├── src/
│   │   ├── config/       # Configuration (DB, Logger)
│   │   ├── controllers/  # Contrôleurs
│   │   ├── middleware/   # Middlewares
│   │   ├── models/       # Modèles (Repository Pattern)
│   │   ├── routes/       # Routes API
│   │   ├── utils/        # Utilitaires
│   │   ├── app.js        # Configuration Express
│   │   └── server.js     # Point d'entrée
│   ├── tests/            # Tests unitaires/intégration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Composants React
│   │   ├── services/     # Appels API
│   │   ├── styles/       # CSS vanilla
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── docker-compose.yml
└── .github/workflows/    # CI/CD
 
# 🛡️ Sentinel — Predictive Maintenance System

Système industriel complet de supervision et de maintenance prédictive basé sur le jeu de données **Microsoft Azure Predictive Maintenance**.

L'application permet aux ingénieurs et techniciens de superviser en temps réel le parc de machines, de gérer le cycle de vie des équipements (CRUD administratif), de visualiser les signaux de télémétrie capteurs (tension, rotation, pression, vibration), de suivre les alertes de défaillance et de consulter les inférences du modèle de Machine Learning.

---

## 📑 Table des Matières

1. [Architecture](#-architecture)
2. [Principe Architectural : CRUD Machines vs Événements Kafka](#-principe-architectural--crud-machines-vs-événements-kafka)
3. [Prérequis Système](#-prérequis-système)
4. [Guide de Démarrage Rapide](#-guide-de-démarrage-rapide)
5. [Étape 1 : Démarrer PostgreSQL](#-étape-1--démarrer-postgresql)
6. [Étape 2 : Démarrer le Backend Spring Boot](#-étape-2--démarrer-le-backend-spring-boot)
7. [Étape 3 : Installer & Démarrer le Frontend React + Vite](#-étape-3--installer--démarrer-le-frontend-react--vite)
8. [Configuration Frontend (.env)](#-configuration-frontend-env)
9. [Documentation Swagger UI](#-documentation-swagger-ui)
10. [Gestion Administrative des Machines (CRUD REST)](#-gestion-administrative-des-machines-crud-rest)
11. [Référence Complète des APIs REST](#-référence-complète-des-apis-rest)
12. [Données de Démonstration (DEMO DATA)](#-données-de-démonstration-demo-data)
13. [Vérification & Tests](#-vérification--tests)
14. [Dépannage & FAQ](#-dépannage--faq)

---

## 🏛️ Architecture

### Phase Actuelle (Opérationnelle)

```text
┌─────────────────────────────────────────────────────────────┐
│                 React + TypeScript + Vite                   │
│   (Tableau de bord, CRUD Machines, Télémétrie, Alertes, ML) │
│                     http://localhost:5173                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ Appels HTTP / Axios REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Spring Boot 3.3 (Java 17)                   │
│     (REST Controllers, Services Métier, Flyway, DTOs)       │
│                     http://localhost:8080                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ Spring Data JPA / JDBC
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL 14+ / 16                        │
│   (Machines, Télémétrie, Prédictions, Maintenance, Erreurs) │
│                     Port 5432 / 5433                        │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Principe Architectural : CRUD Machines vs Événements Kafka

> [!IMPORTANT]
> **Règle fondamentale de séparation des flux :**
> - **Gestion Administrative (Machines)** : Les machines sont créées, consultées, modifiées et supprimées **exclusivement via l'API REST Spring Boot** par un administrateur. **Les machines ne sont pas créées automatiquement par Kafka.**
> - **Système Industriel (Kafka)** : Kafka est réservé aux flux d'événements haute fréquence (mesures de capteurs et codes d'erreurs).
> - **Liaison** : Une machine doit donc exister au préalable dans PostgreSQL afin que les événements Kafka de télémétrie (`machine-telemetry`) ou d'erreurs (`machine-errors`) puissent être rattachés à son identifiant unique (`machineIdentifier` / `machineId`).

```text
ADMINISTRATION (REST)
──────────────────────────────────────────────────────────
Administrateur ──► Frontend React ──► POST /api/machines ──► Spring Boot ──► PostgreSQL (machines)

SYSTÈME INDUSTRIEL (KAFKA - Phase ultérieure)
──────────────────────────────────────────────────────────
Capteurs Machine ──► Topic Kafka ──► Spring Boot Consumer ──► PostgreSQL (telemetry / errors)
                                                                 ▲
                                                                 │ Liaison via machineIdentifier
```

---

## 📋 Prérequis Système

Pour exécuter l'ensemble de la plateforme sur votre machine (Windows, macOS ou Linux), assurez-vous d'avoir installé :

| Composant | Version minimale requise | Commande de vérification |
| :--- | :--- | :--- |
| **Java JDK** | Java 17 ou Java 21 LTS | `java -version` |
| **Apache Maven** | Maven 3.8+ (ou wrapper `mvnw`) | `mvn -v` |
| **Node.js** | Node.js 18.x ou 20.x LTS | `node -v` |
| **npm** | npm 9.x ou 10.x | `npm -v` |
| **PostgreSQL** | PostgreSQL 14+ OU Docker Desktop | `psql --version` ou `docker --version` |

---

## ⚡ Guide de Démarrage Rapide

Ouvrez **deux terminaux** distincts :

```bash
# Terminal 1 — Backend Spring Boot
cd backend
mvn spring-boot:run

# Terminal 2 — Frontend React + Vite
cd frontend
npm install
npm run dev
```

- **Frontend React** : [http://localhost:5173](http://localhost:5173)
- **Backend API** : [http://localhost:8080](http://localhost:8080)
- **Documentation Swagger** : [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## 🚀 Étape 1 : Démarrer PostgreSQL

L'application Spring Boot se connecte à une base de données nommée **`predictive_maintenance`**.

### Option A : Avec Docker (Recommandé)

Lancez un conteneur PostgreSQL isolé en une seule commande :

```bash
docker run --name sentinel-postgres \
  -e POSTGRES_DB=predictive_maintenance \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:16-alpine
```

Pour redémarrer un conteneur existant :
```bash
docker start sentinel-postgres
```

### Option B : PostgreSQL Installé en Local

1. Connectez-vous à PostgreSQL :
   ```bash
   psql -U postgres
   ```
2. Créez la base de données :
   ```sql
   CREATE DATABASE predictive_maintenance;
   ```

---

## ⚙️ Étape 2 : Démarrer le Backend Spring Boot

> [!IMPORTANT]
> PostgreSQL doit être démarré et accessible avant de lancer le backend.

1. Ouvrez un terminal dans le répertoire **`backend/`** :
   ```bash
   cd backend
   ```

2. Compilez et lancez l'application avec Maven :
   ```bash
   mvn spring-boot:run
   ```
   *(Ou sous Windows sans Maven installé globalement : `.\mvnw.cmd spring-boot:run`)*

3. **Migrations Automatiques Flyway** :
   Au démarrage, Flyway applique automatiquement :
   - `V1__create_schema.sql` : Création des tables `machines`, `telemetry`, `predictions`, `maintenance`, `errors`.
   - `V2__insert_demo_data.sql` : Insertion des 10 machines de démonstration avec télémétrie sur 24h, prédictions ML et historiques.

4. **Vérification du Backend** :
   - Statut de santé : [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health) (réponse : `{"status":"UP"}`)
   - Synthèse Dashboard : [http://localhost:8080/api/dashboard](http://localhost:8080/api/dashboard)

---

## 💻 Étape 3 : Installer & Démarrer le Frontend React + Vite

1. Ouvrez un second terminal dans le répertoire **`frontend/`** :
   ```bash
   cd frontend
   ```

2. **Installer les dépendances npm** :
   ```bash
   npm install
   ```

3. **Configurer l'environnement** :
   ```bash
   cp .env.example .env
   ```

4. **Démarrer le serveur de développement Vite** :
   ```bash
   npm run dev
   ```

5. **Accéder à l'application web** :
   Ouvrez votre navigateur sur : **`http://localhost:5173`**

---

## 🔧 Configuration Frontend (.env)

Dans le dossier `frontend/`, la configuration de l'API est gérée via un fichier `.env` :

```env
# URL de base de l'API REST Spring Boot
VITE_API_BASE_URL=http://localhost:8080
```

- **Instance Axios** ([`frontend/src/api/axiosInstance.ts`](file:///d:/predictive-maintenance-system-V0/frontend/src/api/axiosInstance.ts)) lit `import.meta.env.VITE_API_BASE_URL` pour cibler le backend Spring Boot.

---

## 📖 Documentation Swagger UI

Une fois le backend démarré, accédez à la documentation OpenAPI interactive :

🔗 **`http://localhost:8080/swagger-ui.html`**

---

## 🛠️ Gestion Administrative des Machines (CRUD REST)

### 1. Créer une machine (`POST /api/machines`)
Crée une nouvelle machine industrielle dans PostgreSQL.

- **Requête HTTP** :
  ```http
  POST /api/machines
  Content-Type: application/json

  {
    "machineIdentifier": "MCH-011",
    "model": "model2",
    "age": 4
  }
  ```
- **Réponse (`201 Created`)** :
  ```json
  {
    "id": 11,
    "machineIdentifier": "MCH-011",
    "model": "model2",
    "age": 4,
    "riskLevel": "NORMAL",
    "lastPrediction": null,
    "createdAt": "2026-08-28T10:00:00Z",
    "updatedAt": "2026-08-28T10:00:00Z"
  }
  ```
- **Règles de validation** :
  - `machineIdentifier` : Obligatoire, max 50 caractères, unique dans PostgreSQL (erreur `400 Bad Request` si doublon).
  - `model` : Obligatoire, max 50 caractères.
  - `age` : Obligatoire, entier positif ou nul.

### 2. Lister toutes les machines (`GET /api/machines`)
Retourne l'ensemble des machines avec leur niveau de risque calculé (`NORMAL` ou `AT_RISK`).
- **Filtres optionnels** : `?search=MCH&model=model2&riskLevel=AT_RISK`

### 3. Consulter une machine par ID (`GET /api/machines/{id}`)
Retourne la machine et sa dernière prédiction enregistrée (erreur `404 Not Found` si inexistante).

### 4. Modifier une machine (`PUT /api/machines/{id}`)
Met à jour les attributs administratifs (`machineIdentifier`, `model`, `age`).
- **Requête HTTP** :
  ```http
  PUT /api/machines/11
  Content-Type: application/json

  {
    "machineIdentifier": "MCH-011-REV",
    "model": "model3",
    "age": 5
  }
  ```
- **Réponse (`200 OK`)** : Machine mise à jour.

### 5. Supprimer une machine (`DELETE /api/machines/{id}`)
Supprime la machine du parc. Les données associées (télémétrie, erreurs, maintenances, prédictions) sont nettoyées en cascade.
- **Réponse (`204 No Content`)**.

---

## 🔌 Référence Complète des APIs REST

| Ressource | Méthode | Endpoint | Client Frontend | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | `GET` | `/api/dashboard` | `dashboardApi.getDashboard()` | Synthèse consolidée (KPIs, alertes, erreurs, maintenances) |
| **Machines** | `GET` | `/api/machines` | `machineApi.getMachines(params)` | Liste des machines avec filtres `search`, `model`, `riskLevel` |
| | `GET` | `/api/machines/{id}` | `machineApi.getMachineById(id)` | Détail d'une machine et dernière prédiction |
| | `POST` | `/api/machines` | `machineApi.createMachine(data)` | **Création administrative d'une machine** |
| | `PUT` | `/api/machines/{id}` | `machineApi.updateMachine(id, data)` | **Modification administrative d'une machine** |
| | `DELETE` | `/api/machines/{id}` | `machineApi.deleteMachine(id)` | **Suppression d'une machine** |
| **Télémétrie** | `GET` | `/api/machines/{id}/telemetry` | `telemetryApi.getMachineTelemetry(id, p)`| Séries temporelles capteurs (`?period=6h`, `24h`, `7d`) |
| | `GET` | `/api/machines/{id}/telemetry/latest` | `telemetryApi.getLatestTelemetry(id)`| Dernière mesure reçue |
| | `POST` | `/api/telemetry` | `telemetryApi.recordTelemetry(data)` | Ingestion manuelle d'une mesure |
| **Prédictions** | `GET` | `/api/predictions` | `predictionApi.getPredictions(params)` | Historique des prédictions (Lecture seule). Filtres : `?component=`, `?status=` |
| *(Read-Only)* | `GET` | `/api/predictions/latest` | `predictionApi.getLatestPredictions()` | Dernières prédictions par machine |
| | `GET` | `/api/machines/{id}/predictions` | `predictionApi.getMachinePredictions(id)` | Historique des prédictions pour une machine |
| | `GET` | `/api/machines/{id}/predictions/latest`| `predictionApi.getLatestMachinePrediction(id)`| Dernière prédiction d'une machine |
| **Alertes** | `GET` | `/api/alerts` | `alertApi.getActiveAlerts()` | Liste des machines nécessitant une intervention préventive |
| **Maintenance** | `GET` | `/api/machines/{id}/maintenance` | `maintenanceApi.getMaintenanceByMachineId(id)` | Historique des interventions de maintenance |
| | `POST` | `/api/machines/{id}/maintenance` | `maintenanceApi.recordMaintenance(id, data)` | Enregistrement d'une nouvelle intervention |
| **Erreurs** | `GET` | `/api/machines/{id}/errors` | `errorApi.getErrorsByMachineId(id)` | Historique des codes erreurs matériels |
| **ML Pipeline** | `GET` | `/api/ml/pipeline-status` | `mlApi.getPipelineStatus()` | Statut simulé du pipeline Airflow (DEMO DATA) |
| *(DEMO)* | `GET` | `/api/ml/model` | `mlApi.getModelInfo()` | Métriques de validation du modèle (Accuracy, F1-Score...) |

---

## 📦 Données de Démonstration (DEMO DATA)

Le jeu de données inséré automatiquement par Flyway contient :

- **10 Machines Industrielles** (`MCH-001` à `MCH-010`) avec différents modèles (`model1`, `model2`, `model3`, `model4`) et âges (2 à 20 ans).
- **Profils de Risque Réalistes** :
  - `MCH-001` : Risque **CRITIQUE** sur `comp2` (probabilité 88%) avec dérive de pression et de vibration.
  - `MCH-004` : Risque **ATTENTION** sur `comp4` (probabilité 74%) avec élévation de tension et rotation.
  - `MCH-007` : Risque **CRITIQUE** sur `comp3` (probabilité 91%).
  - `MCH-008` : Risque **ATTENTION** sur `comp1` (probabilité 68%).
  - `MCH-002`, `MCH-003`, `MCH-005`, `MCH-006`, `MCH-009`, `MCH-010` : Risque **NORMAL** (`none`, probabilité < 15%).

---

## 🔍 Vérification & Tests

### 1. Tests Automatisés Backend
Exécutez la suite de tests automatisés (Spring Boot WebMvc, Services, Mappers, Validations) :
```bash
cd backend
mvn test
```

### 2. Validation de la Compilation Frontend
```bash
cd frontend
npm run build
```

---

## ❓ Dépannage & FAQ

### Q1 : `Une machine avec l'identifiant 'MCH-001' existe déjà`
- **Cause** : L'identifiant machine (`machineIdentifier`) est soumis à une contrainte d'unicité dans PostgreSQL.
- **Solution** : Choisissez un identifiant distinct (ex: `MCH-011`, `MCH-012`).

### Q2 : `Connection refused: localhost:5432` au démarrage du backend
- **Cause** : PostgreSQL n'est pas démarré ou n'écoute pas sur le port configuré.
- **Solution** : Lancez `docker start sentinel-postgres` ou vérifiez votre instance locale avec `psql -U postgres`.

### Q3 : Pourquoi la création des machines ne passe-t-elle pas par Kafka ?
- **Réponse** : La création d'une machine est une opération administrative qui définit l'existence de l'actif industriel dans le référentiel PostgreSQL. Kafka est utilisé pour les événements streaming haute fréquence émis par les capteurs de cette machine existante.

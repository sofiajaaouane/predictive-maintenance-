# Sentinel — Architecture Technique

## 1. Vue d'ensemble

Sentinel est une plateforme industrielle de maintenance prédictive basée sur le **Microsoft Azure Predictive Maintenance Dataset**.

Le système est conçu selon une séparation stricte des responsabilités afin de garantir la scalabilité, la maintenabilité et l'indépendance des composants de Machine Learning et d'ingestion temps réel.

---

## 2. Architecture Phase 1 (Actuelle)

Dans cette première phase, le système repose sur une architecture 3-tiers standard :

```text
React (TypeScript + Vite)
         │
         │ REST / HTTP (Axios)
         ▼
Spring Boot 3.3 (Java 17)
         │
         │ JPA / Flyway
         ▼
PostgreSQL (predictive_maintenance)
```

### Rôles des composants en Phase 1 :
* **React Frontend** : Interface de visualisation, dashboard de supervision du parc, exploration des séries temporelles de télémétrie (6h, 24h, 7j), consultation des risques et des historiques d'interventions/erreurs.
* **Spring Boot Backend** : Exposition des API REST, persistance des données métier, validation des entrées, calcul des agrégations et statuts de risque dérivés applicatifs (`NORMAL`, `AT_RISK`).
* **PostgreSQL** : Stockage relationnel de la base `predictive_maintenance` (machines, telemetry, predictions, maintenance, errors).

---

## 3. Architecture Future (Phases Ultérieures)

L'architecture cible complète intégrera le streaming d'événements et l'orchestration MLOps quotidienne :

```text
       Python Simulator (Machines)
                   │
                   │ Événements télémétrie temps réel
                   ▼
                 Kafka (topic: machine-telemetry)
                   │
                   │ Ingestion streaming
                   ▼
              Spring Boot (Consumer -> TelemetryService)
                   │
                   │ Persistance mesures
                   ▼
              PostgreSQL (predictive_maintenance)
                   ▲
                   │
                   │ Lecture historique (données, erreurs, maintenance)
                   │ Écriture des prédictions calculées (comp1-4, none, proba)
                   │
           Python ML Service (Feature Engineering + Inférence)
                   ▲
                   │
               Airflow (Orchestration batch quotidienne à 06h00)
                   │
                   │ Chargement du modèle de production
                   ▼
                 MLflow (Model Registry & Experiment Tracking)
```

```text
React (Visualisation)
   │
   │ REST API
   ▼
Spring Boot
   │
   ▼
PostgreSQL
```

---

## 4. Décisions Fondamentales d'Architecture

### 1. Pourquoi le Feature Engineering et le ML ne sont PAS dans Spring Boot ?
* Le Feature Engineering (calcul des rolling means 3h/24h, rolling std 3h/24h, comptage des erreurs sur 24h, calcul des jours depuis la dernière maintenance de chaque composant) ainsi que l'entraînement et l'inférence des modèles (LightGBM, XGBoost, Scikit-learn) appartiennent exclusivement à l'écosystème Python / MLOps.
* Spring Boot reste un backend applicatif performant, robuste et orienté gestion/ingestion, sans adhérence avec les bibliothèques scientifiques et modèles ML.

### 2. Pourquoi les prédictions sont en lecture seule pour Spring Boot et React ?
* Les prédictions représentent la sortie d'un pipeline d'inférence orchestré par Airflow.
* Il n'existe pas de création unitaire à la demande (`POST /api/predictions`). Les prédictions sont générées par batch quotidien et stockées dans PostgreSQL pour consultation.
* React et Spring Boot n'ont aucun rôle de déclenchement ou de création de prédiction.

### 3. Pourquoi Kafka n'est pas inclus en Phase 1 ?
* La Phase 1 stabilise le modèle de données, les contrats REST, les requêtes temporelles PostgreSQL et l'interface utilisateur.
* `TelemetryService` est architecturé comme point d'entrée unique de persistance : en phase future, le `KafkaConsumer` appellera simplement `TelemetryService.recordTelemetry(...)` sans modifier la logique métier.

### 4. Pourquoi la base de données applicative est indépendante d'Airflow ?
* La base `predictive_maintenance` contient les entités du domaine industriel.
* Airflow utilise sa propre base de données de métadonnées interne. Il ne faut jamais mélanger la gestion des tâches d'orchestration avec les données opérationnelles des machines.

### 5. Distinction stricte : Données Natives vs Données Dérivées
* **Données natives** (issues du dataset) : `machineIdentifier`, `model`, `age`, `voltage`, `rotation`, `pressure`, `vibration`, codes erreurs, historique maintenance.
* **Données dérivées** : niveau de risque applicatif (`NORMAL`, `AT_RISK`), calculé à partir de la dernière prédiction (`predictedComponent` et `probability`).
* **Règle** : Les statuts `RUNNING`, `OFFLINE`, `MAINTENANCE` ne sont pas des colonnes de la table `machines`.

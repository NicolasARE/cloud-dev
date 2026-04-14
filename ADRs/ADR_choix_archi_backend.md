# ADR — Architecture backend

## Statut

Accepté (14/04/2026)

---

## 1. Contexte

Le projet backend a initialement été conçu avec une architecture simplifiée de type : `routes → persistence (db)`

Dans cette approche, les routes Express contenaient à la fois :
- la gestion HTTP (req, res)
- la logique métier
- l’accès aux données

Avec l’évolution du projet (ajout de validation, règles métier, typage TypeScript, tests unitaires), cette structure a montré ses limites en termes de maintenabilité, testabilité et évolutivité.

Nous avons donc décidé de refactoriser vers une architecture en couches (N-tier).

---

## 2. Décision

Nous adoptons une architecture **N-tier** structurée comme suit : `controllers/ → services/ → repositories/ → persistence/`


### Rôles des couches :

- **Controllers**
  - Gèrent les requêtes HTTP (Request / Response)
  - Traduisent les erreurs en réponses HTTP
  - Ne contiennent pas de logique métier

- **Services**
  - Contiennent la logique métier
  - Valident les données (ex: nom requis)
  - Orchestrent les opérations

- **Repositories**
  - Abstraction de l’accès aux données
  - Interface entre service et base de données

- **Persistence**
  - Implémentation technique (SQLite/MySQL)

---

## 3. Alternatives considérées

### 3.1 Architecture initiale (routes → db)

**Avantages :**
- Simple à mettre en place
- Peu de fichiers
- Rapide pour un prototype

**Inconvénients :**
- Mélange des responsabilités (HTTP + métier + DB)
- Difficulté à tester (mock compliqué)
- Code peu réutilisable
- Scalabilité limitée

---

### 3.2 Architecture N-tier (choisie)

**Avantages :**
- Séparation claire des responsabilités
- Meilleure testabilité (mock services / repositories)
- Code plus maintenable et lisible
- Évolutivité facilitée
- Compatible avec TypeScript (typage par couche)

**Inconvénients :**
- Plus de fichiers
- Complexité initiale plus élevée

---

### 3.3 Architecture Hexagonale (Ports & Adapters)

**Pourquoi non retenue (pour l’instant) :**
- Trop complexe pour la taille actuelle du projet
- Courbe d’apprentissage plus élevée

---

### 3.4 Architecture Clean Architecture

**Pourquoi non retenue :**
- Très adaptée aux projets critiques ou complexes
- Nécessite beaucoup de structure (use cases, entities, interfaces)
- Surdimensionnée pour ce projet

---

## 4. Conséquences

### Positives

- ✔ Meilleure organisation du code
- ✔ Tests unitaires facilités (mock des services/repositories)
- ✔ Isolation des responsabilités
- ✔ Facilité d’évolution (ex: changer la base de données)
- ✔ Réutilisation de la logique métier

---

### Négatives

- ❗ Augmentation du nombre de fichiers
- ❗ Nécessite une discipline d’architecture
- ❗ Légère complexité supplémentaire pour les nouveaux développeurs

---

## 5. Conclusion

L’architecture N-tier représente un bon compromis entre :
- simplicité
- maintenabilité
- évolutivité

Elle permet de structurer correctement le projet sans introduire la complexité d’architectures plus avancées comme l’hexagonale ou la clean architecture, tout en corrigeant les limites de l’architecture initiale.

Cette décision est adaptée à la taille actuelle du projet et reste évolutive vers des architectures plus avancées si nécessaire.
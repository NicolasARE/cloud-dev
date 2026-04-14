# ADR — Architecture frontend (client)

## Statut

Accepté

---

## Contexte

Le frontend du projet (React + TypeScript + Vite) a évolué vers une complexité croissante, rendant la maintenance et les tests plus difficiles.

Initialement, la logique métier, les appels API et les composants React étaient fortement couplés, ce qui entraînait :

- une faible séparation des responsabilités
- des tests difficiles à isoler
- une forte dépendance à `fetch` et aux détails d’implémentation Vite (`import.meta`)
- une difficulté à faire évoluer l’architecture (authentification, changement d’API, etc.)

---

## Objectif

Mettre en place une architecture :

- claire et modulaire
- testable facilement
- évolutive
- découplée de l’UI
- alignée avec des pratiques d’architecture modernes

---

## Architecture choisie

L’architecture retenue est une **Clean Architecture simplifiée (ou architecture en couches orientée domaine)**.

Structure du projet :

```
monprojet/
├── application/
│ ├── assets/
│ ├── components/
│
├── domain/
│ ├── models/
│ ├── services/
│ ├── utils/
│ └── apiClient.ts
│
└── tests/
```


---

## Description des couches

### application/

Contient la couche UI (React) :

- composants
- assets
- logique d’affichage

👉 Ne contient aucune logique métier ni appel API direct.

---

### domain/

Contient la logique métier :

- `models/` : types et contrats métier
- `services/` : cas d’usage (ex : `getGreeting`, `addItem`, etc.)
- `utils/` : outils techniques comme `apiClient`

---

### apiClient

Le client API centralise tous les appels HTTP :

- gestion du préfixe `/api`
- future gestion des headers (authentification)
- point unique de configuration réseau

---

## Principes de conception

### 1. Séparation des responsabilités

Chaque couche a un rôle précis :

- UI → affichage
- domain → logique métier
- utils → infrastructure technique

---

### 2. Indépendance de l’UI

Les composants React n’appellent plus directement `fetch`.

Exemple :

```ts
getGreeting()
```
au lieu de :
```
fetch('/api/greeting')
```

---

### 3. Centralisation des appels API

Tous les appels HTTP sont centralisés dans `apiClient`.

Avantages :

- modification de l’URL API en un seul endroit
- ajout facilité d’un système d’authentification (tokens, headers)
- homogénéisation des appels réseau
- réduction du code dupliqué

---

### 4. Domain-first design

Les services représentent les cas d’usage métier de l’application.

Ils encapsulent la logique applicative sans dépendre de React ou de la couche UI.

Exemples :

- `getGreeting.service.ts`
- `addItem.service.ts`
- `updateItem.service.ts`

---

### 5. Testabilité améliorée

Cette architecture améliore fortement la testabilité :

- les services peuvent être mockés facilement
- les composants React ne dépendent plus directement de `fetch`
- suppression des problèmes liés à `import.meta` dans Jest
- isolation claire entre logique métier et UI

---

## Alternatives considérées

### ❌ Architecture sans séparation (flat structure)

- logique mélangée dans les composants
- tests difficiles à maintenir
- forte duplication de logique réseau
- manque de structure à moyen terme

---

### ❌ Appels API directement dans les composants

- couplage fort UI / backend
- difficulté à tester
- absence de couche métier réutilisable
- logique dispersée dans l’application

---

### ❌ MVC classique

- modèle peu adapté aux frameworks modernes comme React
- complexité inutile pour la gestion des composants UI
- manque de flexibilité pour les applications frontend modernes

---

## Avantages de l’architecture retenue

- ✔ séparation claire des responsabilités
- ✔ meilleure maintenabilité du code
- ✔ amélioration significative de la testabilité
- ✔ évolutivité facilitée (authentification, nouveaux services)
- ✔ meilleure organisation globale du projet

---

## Limites

- structure légèrement surdimensionnée pour un petit projet
- discipline nécessaire pour respecter les couches définies
- nécessite une bonne gestion des mocks dans les tests unitaires

---

## Conclusion

L’architecture choisie correspond à une **Clean Architecture simplifiée appliquée au frontend React**.

Elle repose sur une séparation claire entre :

- la couche UI (`application`)
- la logique métier (`domain`)
- l’infrastructure technique (`utils`)

Cette approche améliore la maintenabilité, la testabilité et la scalabilité du projet, tout en restant adaptée à un contexte académique et évolutif vers une architecture professionnelle.
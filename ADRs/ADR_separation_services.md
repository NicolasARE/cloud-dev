# ADR – Séparation du service d’authentification et du backend API

## Statut
Accepté

## Contexte

Initialement, le système d’authentification et le backend applicatif faisaient partie d’un seul service Node.js.  
Ce service unique regroupait :

- la gestion des utilisateurs (inscription, connexion, tokens)
- la logique métier de l’application
- l’accès aux bases de données
- l’ensemble des endpoints API

Avec l’évolution du projet, cette architecture a montré ses limites.

---

## Problème

### Couplage fort des responsabilités
L’authentification et la logique métier étaient dans le même codebase, ce qui augmentait les risques d’effets de bord lors des modifications.

### Maintenance complexe
Chaque évolution du système d’auth nécessitait de comprendre et potentiellement modifier l’ensemble du backend.

### Risques de sécurité
L’authentification est une brique critique. Son intégration dans le même service que la logique métier augmentait la surface d’attaque.

### Scalabilité limitée
Impossible de scaler indépendamment l’authentification et le backend applicatif.

### Déploiements couplés
Toute modification du système d’auth nécessitait un redéploiement complet du backend.

---

## Décision

Nous séparons désormais le système en deux services indépendants :

- `auth` : service dédié à l’authentification (utilisateurs, sessions, tokens, sécurité)
- `backend` : service dédié à la logique métier et aux API applicatives

La communication entre services se fait via Kafka.

---

## Conséquences

### Avantages

- Meilleure séparation des responsabilités (SoC)
- Isolation du système d’authentification
- Maintenance plus simple et plus lisible
- Scalabilité indépendante des services
- Déploiements plus sûrs et modulaires
- Possibilité de remplacer le service d’auth sans impacter le backend

### Inconvénients

- Complexité d’architecture accrue (communication inter-services)
- Gestion de la cohérence entre services
- Charge DevOps légèrement plus importante

---

## Alternatives considérées

### Monolithe conservé
Rejeté en raison des problèmes de scalabilité et de maintenance.

### Extraction partielle en module interne
Rejeté car insuffisant pour résoudre le couplage au niveau runtime.

---

## Conclusion

La séparation du service d’authentification du backend applicatif améliore la modularité, la sécurité et la scalabilité du système, au prix d’une complexité d’architecture légèrement accrue mais maîtrisée.
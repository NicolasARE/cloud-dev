# ADR : Stratégie de Persistance pour les Tests Automatisés

*   **Statut** : Accepté

## Contexte
Dans le cadre du développement de notre application TODO multi-utilisateur, nous utilisons **MySQL** comme système de gestion de base de données (SGBD) principal pour les environnements de développement et de production (via Docker). 

Une question s'est posée quant à l'utilisation du même SGBD pour l'exécution de la suite de tests automatisés (Backend), ou l'utilisation d'une solution alternative plus légère.

## Décision
Nous avons décidé de conserver **SQLite (in-memory)** comme moteur de persistance pour l'ensemble des tests unitaires et d'intégration, tout en maintenant MySQL pour la production. 

Le basculement entre les deux moteurs s'effectue dynamiquement au niveau de la couche d'abstraction de données (Persistence Layer) via une variable d'environnement (`MYSQL_HOST`).

## Justification
Ce choix repose sur quatre piliers fondamentaux de l'ingénierie logicielle :

1.  **Vitesse d'exécution** : SQLite *in-memory* est nettement plus rapide que MySQL. Pour une suite de tests amenée à croître, le temps de feedback pour le développeur doit rester minimal (< 5 secondes).
2.  **Isolation et Éphémérité** : Une base SQLite en mémoire est recréée à chaque lancement de test. Cela garantit qu'aucun résidu de données d'un test précédent ne vient polluer les résultats (Tests Deterministes).
3.  **Démonstration du Design Pattern Repository** : Ce choix technique prouve la robustesse de notre architecture. En utilisant une interface commune (`Database`), nous démontrons que notre logique métier est totalement agnostique du support de stockage. C'est un point clé pour l'évolutivité du projet.
4.  **Similité CI/CD** : L'utilisation de SQLite simplifie grandement l'intégration continue. Il n'est pas nécessaire de monter un service MySQL complet dans le runner (GitHub Actions/Lab), ce qui réduit la consommation de ressources et les risques d'erreurs réseau.

## Conséquences
*   **Positives** : Suite de tests ultra-performante, tests faciles à lancer en local sans Docker, validation concrète du découplage architecturel.
*   **Négatives** : Risque théorique de "dérive de compatibilité" (une requête SQL spécifique fonctionnant sur SQLite mais pas sur MySQL). Pour limiter ce risque, nous nous en ténons à du SQL standard supporté par les deux moteurs.

## Conclusion
Ce choix est un compromis technologique cohérent pour un projet, privilégiant la **vitesse du cycle de développement** et la **propreté architecturale** sans sacrifier la fiabilité de la production.

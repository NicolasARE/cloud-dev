# ADR : Stratégie de Monitoring et Observabilité Full-Stack

*   **Statut** : Accepté

## Contexte
Avec le passage à une architecture conteneurisée (Docker) et multi-utilisateur, la visibilité sur l'état de santé du système et les performances est devenue critique. Nous avons besoin de suivre :
1.  Les métriques systèmes et applicatives (CPU, Mémoire, débit HTTP).
2.  Les logs centralisés pour le débuggage.
3.  Les traces distribuées pour comprendre la latence entre les services.

## Décision
Nous avons décidé d'implémenter une stack d'observabilité complète basée sur des standards open-source, intégrée directement dans notre infrastructure `docker-compose`.

La stack retenue est composée de :
*   **Prometheus** : Serveur de métriques pour le stockage des données temporelles.
*   **Grafana** : Interface de visualisation pour les tableaux de bord.
*   **Loki & Promtail** : Gestion centralisée des logs (Loki pour le stockage, Promtail pour la collecte des logs Docker).
*   **Jaeger** : Collecte et visualisation des traces distribuées (OpenTelemetry).

## Justification
Ce choix se base sur plusieurs critères académiques et techniques (M2) :

1.  **L'approche "Best-of-Breed"** : Contrairement à une solution monolithique, cette stack permet d'utiliser le meilleur outil pour chaque besoin (Prometheus pour les métriques, Loki pour les logs), tout en étant parfaitement intégrés entre eux (Grafana peut interroger les deux).
2.  **Standard OpenTelemetry** : Le backend Node.js utilise le SDK OpenTelemetry pour générer des traces envoyées à Jaeger. Cela garantit que notre application n'est pas "enfermée" chez un fournisseur spécifique (No Vendor Lock-in).
3.  **Scalabilité et Docker-Native** : Tous ces outils sont nativement compatibles avec Docker. L'utilisation de Promtail permet de collecter les logs directement depuis le démon Docker sans modifier le code de nos applications.
4.  **Coût et Portabilité** : Toute la stack est gratuite, open-source et peut être déployée sur n'importe quel serveur On-Premise ou Cloud sans configuration complexe grâce aux fichiers `yaml`.

## Conséquences
*   **Positives** : Capacité de troubleshooting avancée (on peut corréler une trace Jaeger avec un log Loki), visibilité en temps réel sur les performances, stack professionnelle valorisable lors de l'oral.
*   **Négatives** : Consommation de ressources accrue sur la machine locale (CPU/RAM) pour faire tourner tous les conteneurs de monitoring.

## Conclusion
L'adoption de cette stack transforme notre simple TODO app en un système distribué "observables", respectant les standards actuels de l'ingénierie DevOps.

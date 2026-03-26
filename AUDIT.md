# Audit et État Initial du Projet

## Responsabilités Mélangées
- **`src/index.js`** : Gère à la fois le démarrage du serveur Express, la définition des routes et le cycle de vie de la base de données (init/teardown).
- **Gestionnaires de routes (`src/routes/*.js`)** : Ils contiennent à la fois la logique HTTP (requêtes/réponses) et des appels directs au module de persistance. Il n'y a pas de couche de service intermédiaire.

## Dépendances Fortes
- **Module `persistence`** : L'application est directement couplée à l'implémentation choisie via `persistence/index.js`.
- **`sqlite3` et FS** : Le fichier `src/persistence/sqlite.js` utilise directement le driver `sqlite3` et le module `fs` pour la gestion des dossiers de données.

## Zones à Risque
- **Persistance SQLite** : La création automatique de dossiers dans `init()` peut échouer selon les permissions de l'environnement (ex: Docker sans volume approprié).
- **Couplage API <-> DB** : Toute modification du schéma de la base de données ou de l'interface de persistance nécessite une mise à jour de tous les fichiers de route.

## Stratégie Git pour la Refonte
Pour chaque étape du processus, suivez ces commandes locales :

1. **Avant de commencer une étape** :
   ```bash
   git status # Vérifiez que vous êtes sur un état propre
   ```

2. **Après avoir effectué les changements d'une étape** :
   ```bash
   git add .
   git commit -m "Refactor: [description courte de l'étape]"
   ```

3. **En cas de problème (retour en arrière)** :
   ```bash
   git reset --hard HEAD # Annule les changements non commités
   # OU
   git checkout HEAD~1   # Revient au commit précédent
   ```

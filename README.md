# Todo App - Dev pour le Cloud

Par Nicolas Arena et Aurélie Runser

## Récupérer le projet

Afin de récupérer ce projet, ouvrez un IDE et/ou un terminal de commande dans le dossier qui doit contenir le projet et tappez la commande : 
```
git clone https://github.com/NicolasARE/cloud-dev.git
cd cloud-dev
```

Afin que le projet fonctionne, pensez à dupliquer le fichier `.env.example` et renommer cette copie `.env`.

Voici les variables à renseigner : 

| Variable | Description |
|----------|-------------|
| MYSQL_HOST | nom de l'hote de la bdd |
| MYSQL_USER | nom du user de la bdd |
| MYSQL_PASSWORD | mot de passe de la bdd |
| MYSQL_DB | nom de la bdd |
| MYSQL_ROOT_PASSWORD | mot de passe utilisé par le backend pour se connecter à la bdd (doit être égale à MYSQL_PASSWORD) |
| MYSQL_DATABASE | nom de la bdd utilisé par le backend pour se connecter à la bdd (doit être égale à MYSQL_DB) |
| PMA_HOST | nol d'hote utiliser par phpMyAdmint( doit être égale à MYSQL_HOST) |
| PMA_USER | nom d'utilisateur utilisé par phpMyAdmin pour se connecter à la bdd (doit être égale à MYSQL_USER) |
| PMA_PASSWORD | mot de passe utilisé par phpMyAdmin pour se connecter à la bdd (doit être égale à MYSQL_PASSWORD) |
| VITE_API_URL | url utilisé par le frontend (client) pour accéder au backend (doit être `/api/`) |

Voici un exemple de ce que peut être `.env` : 
```
# backend
MYSQL_HOST=mysql
MYSQL_USER=node
MYSQL_PASSWORD=secret
MYSQL_DB=todos

# mysql
MYSQL_ROOT_PASSWORD=secret
MYSQL_DATABASE=todos

# phpmyadmin
PMA_HOST=mysql
PMA_USER=node
PMA_PASSWORD=secret

# client
VITE_API_URL=/api/
```

Vous devez aussi installer les dépendances dans chaque service afin de pouvoir lancer les tests.

Installer les dépendances du backend en partant de la racine du projet : 
```
cd backend
npm i
```
Installer les dépendances du frontend en partant de la racine du projet : 
```
cd client
npm i
```

## Lancer le Projet

Afin de lancer, vous devez avec Docker Desktop installé.

### Mode Dev
(Pas besoin de relancer les container pour voir les changements)
```
docker compose -f compose.dev.yaml up --watch
```

### Mode Prod
(Les outils de monitoring ne sont disponibles qu'en mode prod)
```
docker compose up -d --build
```


## Supprimer les containers

### Mode Dev
```
docker compose -f compose.dev.yaml down
```

### Mode Prod
```
docker compose down
```

## Lancer les tests

### Backend

Avant tout, rendez-vous dans le dossier avec : `cd backend` en partant de la racine du projet.

Tous les tests : `npm test`
Tests unitaires : `npm test units`
Tests d'integrations : `npm test integrations`

Un test précis : `npm test [units OU integrations]/[Nom du fichier à tester]`

### Frontend

Avant tout, rendez-vous dans le dossier avec : `cd client` en partant de la racine du projet.

Tous les tests : `npm run test`
Tests unitaires : `npm test units`
Tests d'integrations : `npm test integrations`


## Outils de monitoring

- Prometheus (Métriques) : accessible sur http://prometheus.localhost
- Grafana (Dashboards & Logs Loki) : accessible sur http://grafana.localhost (admin/admin)
- Jaeger (Traces) : accessible sur http://jaeger.localhost
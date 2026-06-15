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
| MYSQL_HOST_API | Nom de l’hôte Docker de la base de données API (doit être `mysql_api`) |
| MYSQL_USER_API | Nom de l’utilisateur MySQL pour la base API |
| MYSQL_PASSWORD_API | Mot de passe de l’utilisateur MySQL pour la base API |
| MYSQL_DB_API | Nom de la base de données API |
| MYSQL_ROOT_PASSWORD_API | Mot de passe root MySQL pour la base API (utilisé à l’initialisation du conteneur MySQL) |
| MYSQL_DATABASE_API | Nom de la base de données créée automatiquement par MySQL (doit être égal à MYSQL_DB_API) |
| PMA_HOST_API | Nom de l’hôte MySQL utilisé par phpMyAdmin pour la base API (doit être `mysql_api`) |
| PMA_USER_API | Nom d’utilisateur utilisé par phpMyAdmin pour se connecter à la base API |
| PMA_PASSWORD_API | Mot de passe utilisé par phpMyAdmin pour se connecter à la base API |
| MYSQL_HOST_AUTH | Nom de l’hôte Docker de la base de données AUTH (doit être `mysql_auth`) |
| MYSQL_USER_AUTH | Nom de l’utilisateur MySQL pour la base AUTH |
| MYSQL_PASSWORD_AUTH | Mot de passe de l’utilisateur MySQL pour la base AUTH |
| MYSQL_DB_AUTH | Nom de la base de données AUTH |
| MYSQL_ROOT_PASSWORD_AUTH | Mot de passe root MySQL pour la base AUTH (utilisé à l’initialisation du conteneur MySQL) |
| MYSQL_DATABASE_AUTH | Nom de la base de données créée automatiquement par MySQL (doit être égal à MYSQL_DB_AUTH) |
| PMA_HOST_AUTH | Nom de l’hôte MySQL utilisé par phpMyAdmin pour la base AUTH (doit être `mysql_auth`) |
| PMA_USER_AUTH | Nom d’utilisateur utilisé par phpMyAdmin pour se connecter à la base AUTH |
| PMA_PASSWORD_AUTH | Mot de passe utilisé par phpMyAdmin pour se connecter à la base AUTH |
| VITE_API_URL | URL utilisée par le frontend (client) pour accéder au backend (doit être `/api/`) |


Vous devez aussi installer les dépendances dans chaque service afin de pouvoir lancer les tests.

Installer les dépendances du auth en partant de la racine du projet : 
```
cd auth
npm i
```
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

### URL

- client: http://localhost
- auth: http://localhost/auth/greeting
- api: http://localhost/api/greeting
- phpMyAdmin: http://db.localhost


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

Avant tout, rendez-vous dans le dossier avec voulu (client, auth ou backend) en partant de la racine du projet.

### Tous les tests
```
npm test
```

### Tests unitaires
```
npm test units
```

### Tests d'integrations
```
npm test integrations
```


## phpMyAdmin

Pour se connecter à phpMyAdmin, l'url est : 
```
http://db.localhost
```

Ayant 2 base de données, pour vous connecter, utiliser les variables `PMA_HOST_**`, `PMA_USER_**`, `PMA_PASSWORD_**` défini dans `.env` suivant si vous voulez voir la base de donnée des users ou des items.

## Outils de monitoring

Voir le fichier [monitoring.md](https://github.com/NicolasARE/cloud-dev/blob/main/monitoring.md)
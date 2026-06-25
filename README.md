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

Avant tout, rendez-vous dans le dossier voulu (`client`, `auth` ou `backend`) en partant de la racine du projet.

### Tous les tests
```bash
npm test
```

### Tests unitaires
```bash
npm test units
```

### Tests d'intégrations
```bash
npm test integrations
```

### Couverture des tests (Coverage)
Pour générer le rapport de couverture des tests, exécutez la commande suivante dans le dossier du service concerné :
```bash
npm test -- --coverage
```
Cette commande affiche un tableau récapitulatif dans le terminal (pourcentage de lignes, fonctions, branches et instructions couvertes) et génère un dossier `coverage/` contenant un rapport HTML interactif complet (ouvrez `coverage/lcov-report/index.html` dans un navigateur).



## phpMyAdmin

Pour se connecter à phpMyAdmin, l'url est : 
```
http://db.localhost
```

Ayant 2 base de données, pour vous connecter, utiliser les variables `PMA_HOST_**`, `PMA_USER_**`, `PMA_PASSWORD_**` défini dans `.env` suivant si vous voulez voir la base de donnée des users ou des items.

## Outils de monitoring

Voir le fichier [monitoring.md](https://github.com/NicolasARE/cloud-dev/blob/main/monitoring.md)

---

## ☁️ Déploiement Azure (Terraform)

L'infrastructure cloud est entièrement gérée par Terraform dans le dossier [`azure/`](./azure/).

### Infrastructure déployée

| Ressource | Nom | Description |
|---|---|---|
| Resource Group | `rg-todo-app-dev` | Conteneur de toutes les ressources |
| Container Registry (ACR) | `nicoareregistrytodoapp` | Stockage des images Docker |
| Kubernetes Service (AKS) | `aks-todo-app-dev` | Cluster pour les manifests k8s |
| MySQL Flexible Server | `todoapp-flex` | BDD API (`db_api`) et Auth (`db_auth`) |
| Key Vault | `kv-todoapp-[auto]` | Stockage sécurisé des secrets (suffixe aléatoire pour unicité globale) |
| Log Analytics Workspace | `law-todo-app-dev` | Monitoring du cluster AKS |

### Prérequis

- [Terraform](https://developer.hashicorp.com/terraform/install) ≥ 1.0
- [Azure CLI](https://learn.microsoft.com/fr-fr/cli/azure/install-azure-cli) installé et connecté

```bash
az login
az account set --subscription d921f310-a568-43b6-95a7-a16745b6f13f
```

### Déployer l'infrastructure

```bash
cd azure

# 1. Copier et renseigner les variables
cp terraform.tfvars.example terraform.tfvars
# Éditez terraform.tfvars et renseignez mysql_admin_password

# 2. Initialiser Terraform
terraform init

# 3. Vérifier le plan
terraform plan -out main.tfplan

# 4. Appliquer
terraform apply "main.tfplan"
```

> ⏱️ Le déploiement complet prend environ **10–15 minutes** (AKS et MySQL sont les plus longs).

### CI/CD — Pipeline de build Docker

La CI/CD (`.github/workflows/ci.yml`) build et push automatiquement les images Docker vers l'ACR à chaque merge sur `main`.

Pour configurer la CI/CD sur un nouveau fork ou dépôt, ajouter dans **GitHub → Settings → Secrets and variables → Actions** :

| Secret | Valeur |
|---|---|
| `ACR_USERNAME` | `nicoareregistrytodoapp` |
| `ACR_PASSWORD` | *(via `az acr credential show --name nicoareregistrytodoapp`)* |

> **Note :** L'application est déjà déployée et accessible publiquement sur **[http://68.221.250.190](http://68.221.250.190)**. Cette étape de configuration des secrets n'est nécessaire qu'en cas de re-déploiement complet sur un nouveau dépôt.


### Se connecter et lancer le projet avec Kubernetes (AKS)

Suivez ces étapes pour lier votre terminal à Azure et déployer vos ressources Kubernetes sur le cluster.

#### 1. Se connecter à Azure et configurer l'abonnement
```bash
az login
az account set --subscription d921f310-a568-43b6-95a7-a16745b6f13f
```

#### 2. Récupérer les identifiants de connexion du cluster AKS
Cette commande configure votre client `kubectl` local pour lui donner accès au cluster distant :
```bash
az aks get-credentials \
  --resource-group rg-todo-app-dev \
  --name aks-todo-app-dev

# Vérifier la bonne connexion (doit lister vos nœuds de cluster)
kubectl get nodes
```

#### 3. Déployer l'application sur le cluster AKS
Cette commande déploie tous les microservices (client, api, auth, kafka) :
```bash
kubectl apply -k k8s/
```

#### 4. Déployer la supervision et le monitoring (Prometheus + Grafana)
```bash
kubectl apply -k k8s/monitoring/
```

Accéder à Grafana directement en ligne (sans port-forward requis) :
🔗 **[http://70.156.249.81:3000](http://70.156.249.81:3000)** (Identifiants : `admin` / `admin`)

*(Optionnel) Si vous préférez y accéder via un tunnel local :*
```bash
kubectl port-forward svc/grafana 3000:3000 -n monitoring
# Ouvrir http://localhost:3000
```

> Le monitoring Prometheus/Grafana tourne **dans AKS** — c'est du monitoring cloud, pas local.
> Azure Log Analytics est également actif nativement sur le cluster (déployé par Terraform).

### Détruire l'infrastructure

```bash
terraform destroy
```

> ⚠️ **Ne jamais commiter** `terraform.tfvars`, `*.tfstate`, `*.tfplan` ou `.terraform/` — ces fichiers sont dans le `.gitignore`.
# ─────────────────────────────────────────────
# Azure
# ─────────────────────────────────────────────
variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
  default     = "d921f310-a568-43b6-95a7-a16745b6f13f"
}

variable "location" {
  description = "Azure region pour toutes les ressources"
  type        = string
  default     = "spaincentral"
}

variable "project" {
  description = "Nom du projet (utilisé comme préfixe de nommage)"
  type        = string
  default     = "todo-app"
}

variable "environment" {
  description = "Environnement de déploiement"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "La valeur doit être dev, staging ou prod."
  }
}

# ─────────────────────────────────────────────
# AKS
# ─────────────────────────────────────────────
variable "aks_node_count" {
  description = "Nombre de nœuds dans le node pool AKS"
  type        = number
  default     = 1
}

variable "aks_node_vm_size" {
  description = "Taille des VMs pour les nœuds AKS"
  type        = string
  default     = "Standard_B2s"
}

# ─────────────────────────────────────────────
# MySQL
# ─────────────────────────────────────────────
variable "mysql_admin_user" {
  description = "Nom d'utilisateur administrateur MySQL"
  type        = string
  default     = "todoadmin"
}

variable "mysql_admin_password" {
  description = "Mot de passe administrateur MySQL (sensible)"
  type        = string
  sensitive   = true
}

variable "mysql_db_api_name" {
  description = "Nom de la base de données pour le service API"
  type        = string
  default     = "db_api"
}

variable "mysql_db_auth_name" {
  description = "Nom de la base de données pour le service Auth"
  type        = string
  default     = "db_auth"
}

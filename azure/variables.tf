variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
  default     = "d921f310-a568-43b6-95a7-a16745b6f13f"
}

variable "tenant_id" {
  description = "Azure Tenant ID (Ynov) — passer via TF_VAR_tenant_id ou terraform.tfvars"
  type        = string
  default     = ""
}

variable "ressource_group_location" {
  description = "Azure region pour toutes les ressources"
  type        = string
  default     = "spaincentral"
}

variable "ressource_group_prefix" {
  description = "Préfixe du nom du resource group (pour l'unicité via random_pet)"
  type        = string
  default     = "rg"
}

variable "project" {
  description = "Nom du projet utilisé comme préfixe de nommage"
  type        = string
  default     = "todo-app"
}

variable "environment" {
  description = "Environnement de déploiement (dev | staging | prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "La valeur doit être dev, staging ou prod."
  }
}

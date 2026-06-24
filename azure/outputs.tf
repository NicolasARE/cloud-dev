# ─────────────────────────────────────────────
# Resource Group
# ─────────────────────────────────────────────
output "resource_group_name" {
  description = "Nom du resource group"
  value       = azurerm_resource_group.rg.name
}

output "resource_group_location" {
  description = "Région du resource group"
  value       = azurerm_resource_group.rg.location
}

# ─────────────────────────────────────────────
# ACR
# ─────────────────────────────────────────────
output "acr_login_server" {
  description = "URL de connexion au Container Registry"
  value       = azurerm_container_registry.acr.login_server
}

output "acr_admin_username" {
  description = "Nom d'utilisateur admin ACR"
  value       = azurerm_container_registry.acr.admin_username
  sensitive   = true
}

output "acr_admin_password" {
  description = "Mot de passe admin ACR"
  value       = azurerm_container_registry.acr.admin_password
  sensitive   = true
}

# ─────────────────────────────────────────────
# AKS
# ─────────────────────────────────────────────
output "aks_cluster_name" {
  description = "Nom du cluster AKS"
  value       = azurerm_kubernetes_cluster.aks.name
}

output "aks_kube_config" {
  description = "Kubeconfig pour kubectl (az aks get-credentials)"
  value       = azurerm_kubernetes_cluster.aks.kube_config_raw
  sensitive   = true
}

# ─────────────────────────────────────────────
# MySQL
# ─────────────────────────────────────────────
output "mysql_server_fqdn" {
  description = "FQDN du serveur MySQL (utilisé dans les manifests k8s)"
  value       = azurerm_mysql_flexible_server.mysql.fqdn
}

output "mysql_server_name" {
  description = "Nom du serveur MySQL"
  value       = azurerm_mysql_flexible_server.mysql.name
}

# ─────────────────────────────────────────────
# Key Vault
# ─────────────────────────────────────────────
output "key_vault_uri" {
  description = "URI du Key Vault"
  value       = azurerm_key_vault.kv.vault_uri
}

output "key_vault_name" {
  description = "Nom du Key Vault"
  value       = azurerm_key_vault.kv.name
}

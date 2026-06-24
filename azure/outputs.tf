output "rg_name" {
  description = "Nom du resource group créé"
  value       = azurerm_resource_group.rg.name
}

output "registry_name" {
  description = "Nom du registry créé"
  value       = azurerm_container_registry.acr.name
}

output "acr_login_server" {
  description = "URL du serveur de connexion ACR"
  value       = azurerm_container_registry.acr.login_server
}



output "log_analytics_workspace_id" {
  description = "ID du Log Analytics Workspace"
  value       = azurerm_log_analytics_workspace.main.id
}

output "container_app_environment_id" {
  description = "ID du Container App Environment"
  value       = azurerm_container_app_environment.main.id
}

output "container_app_environment_name" {
  description = "Nom du Container App Environment"
  value       = azurerm_container_app_environment.main.name
}

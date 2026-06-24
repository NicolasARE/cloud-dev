# ─────────────────────────────────────────────
# Resource Group (nom aléatoire via random_pet)
# ─────────────────────────────────────────────
resource "random_pet" "rg_random" {
  prefix = var.ressource_group_prefix
}

resource "azurerm_resource_group" "rg" {
  name     = random_pet.rg_random.id
  location = var.ressource_group_location
}

# ─────────────────────────────────────────────
# Azure Container Registry (ACR)
# ─────────────────────────────────────────────
resource "random_string" "name" {
  length  = 6
  lower   = true
  numeric = false
  special = false
  upper   = false
}

resource "azurerm_container_registry" "acr" {
  name                = "${random_string.name.result}registry"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
}

# ─────────────────────────────────────────────
# Azure Container Apps Environment
# ─────────────────────────────────────────────
resource "azurerm_log_analytics_workspace" "main" {
  name                = "law-${var.project}-${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_container_app_environment" "main" {
  name                       = "cae-${var.project}-${var.environment}"
  resource_group_name        = azurerm_resource_group.rg.name
  location                   = azurerm_resource_group.rg.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
}

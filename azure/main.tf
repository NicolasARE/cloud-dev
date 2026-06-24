# ─────────────────────────────────────────────
# Contexte Azure courant
# ─────────────────────────────────────────────
data "azurerm_client_config" "current" {}

# ─────────────────────────────────────────────
# Locals
# ─────────────────────────────────────────────
locals {
  tags = {
    project     = var.project
    environment = var.environment
    managed_by  = "terraform"
  }
}

# ─────────────────────────────────────────────
# Resource Group
# ─────────────────────────────────────────────
resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.project}-${var.environment}"
  location = var.location
  tags     = local.tags
}

# ─────────────────────────────────────────────
# Azure Container Registry (ACR)
# Nom fixe pour correspondre aux manifests k8s et CI/CD
# ─────────────────────────────────────────────
resource "azurerm_container_registry" "acr" {
  name                = "nicoareregistrytodoapp"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true
  tags                = local.tags
}

# ─────────────────────────────────────────────
# Log Analytics Workspace (monitoring AKS)
# ─────────────────────────────────────────────
resource "azurerm_log_analytics_workspace" "main" {
  name                = "law-${var.project}-${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = local.tags
}

# ─────────────────────────────────────────────
# AKS — Azure Kubernetes Service
# ─────────────────────────────────────────────
resource "azurerm_kubernetes_cluster" "aks" {
  name                = "aks-${var.project}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "${var.project}-${var.environment}"

  default_node_pool {
    name       = "system"
    node_count = var.aks_node_count
    vm_size    = var.aks_node_vm_size
  }

  identity {
    type = "SystemAssigned"
  }

  oms_agent {
    log_analytics_workspace_id      = azurerm_log_analytics_workspace.main.id
    msi_auth_for_monitoring_enabled = true
  }

  tags = local.tags
}

# Autorisation AKS → ACR (pull d'images)
resource "azurerm_role_assignment" "aks_acr_pull" {
  principal_id                     = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.acr.id
  skip_service_principal_aad_check = true
}

# ─────────────────────────────────────────────
# Azure Database for MySQL Flexible Server
# Nom fixe "todoapp" → FQDN = todoapp.mysql.database.azure.com
# (correspond au configmap k8s existant)
# ─────────────────────────────────────────────
resource "azurerm_mysql_flexible_server" "mysql" {
  name                   = "todoapp-flex"
  resource_group_name    = azurerm_resource_group.rg.name
  location               = azurerm_resource_group.rg.location
  administrator_login    = var.mysql_admin_user
  administrator_password = var.mysql_admin_password
  sku_name               = "B_Standard_B1ms"
  version                = "8.0.21"

  backup_retention_days        = 7
  geo_redundant_backup_enabled = false

  tags = local.tags
}

# Bases de données MySQL
resource "azurerm_mysql_flexible_database" "db_api" {
  name                = var.mysql_db_api_name
  resource_group_name = azurerm_resource_group.rg.name
  server_name         = azurerm_mysql_flexible_server.mysql.name
  charset             = "utf8mb4"
  collation           = "utf8mb4_unicode_ci"
}

resource "azurerm_mysql_flexible_database" "db_auth" {
  name                = var.mysql_db_auth_name
  resource_group_name = azurerm_resource_group.rg.name
  server_name         = azurerm_mysql_flexible_server.mysql.name
  charset             = "utf8mb4"
  collation           = "utf8mb4_unicode_ci"
}

# Règle firewall : autoriser les services Azure (AKS inclus)
resource "azurerm_mysql_flexible_server_firewall_rule" "allow_azure_services" {
  name                = "allow-azure-services"
  resource_group_name = azurerm_resource_group.rg.name
  server_name         = azurerm_mysql_flexible_server.mysql.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

# ─────────────────────────────────────────────
# Azure Key Vault
# Stocke les secrets sensibles (mots de passe, credentials ACR…)
# ─────────────────────────────────────────────
resource "random_string" "kv_suffix" {
  length  = 4
  lower   = true
  numeric = true
  special = false
  upper   = false
}

resource "azurerm_key_vault" "kv" {
  name                       = "kv-todoapp-${random_string.kv_suffix.result}"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  purge_protection_enabled   = false
  soft_delete_retention_days = 7
  tags                       = local.tags
}

# Accès Terraform (utilisateur courant) au Key Vault
resource "azurerm_key_vault_access_policy" "terraform_user" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id

  secret_permissions = [
    "Get", "List", "Set", "Delete", "Purge", "Recover"
  ]
}

# Secrets stockés dans le Key Vault
resource "azurerm_key_vault_secret" "mysql_password" {
  name         = "mysql-admin-password"
  value        = var.mysql_admin_password
  key_vault_id = azurerm_key_vault.kv.id
  depends_on   = [azurerm_key_vault_access_policy.terraform_user]
}

resource "azurerm_key_vault_secret" "acr_username" {
  name         = "acr-admin-username"
  value        = azurerm_container_registry.acr.admin_username
  key_vault_id = azurerm_key_vault.kv.id
  depends_on   = [azurerm_key_vault_access_policy.terraform_user]
}

resource "azurerm_key_vault_secret" "acr_password" {
  name         = "acr-admin-password"
  value        = azurerm_container_registry.acr.admin_password
  key_vault_id = azurerm_key_vault.kv.id
  depends_on   = [azurerm_key_vault_access_policy.terraform_user]
}

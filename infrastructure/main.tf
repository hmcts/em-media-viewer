provider "azurerm" {
  features {}
}

locals {
  app_full_name = "${var.product}-${var.component}"

  asp_name = "em-media-viewer-${var.env}"
  asp_rg = "em-em-media-viewer-${var.env}"

  ase_name = "core-compute-${var.env}"
  local_env = var.env == "preview" ? "aat" : var.env
  local_ase = var.env == "preview" ? "core-compute-aat" : local.ase_name
  resource_group_name = "${local.app_full_name}-${var.env}"
}

resource "azurerm_resource_group" "rg" {
  name     = local.resource_group_name
  location = var.location

  tags = var.common_tags
}

module "local_key_vault" {
  source = "git@github.com:hmcts/cnp-module-key-vault?ref=master"
  product = local.app_full_name
  env = var.env
  tenant_id = var.tenant_id
  object_id = var.jenkins_AAD_objectId
  resource_group_name = azurerm_resource_group.rg.name
  product_group_object_id = "5d9cd025-a293-4b97-a0e5-6f43efce02c0"
  common_tags = var.common_tags
  managed_identity_object_ids = ["${data.azurerm_user_assigned_identity.rpa-shared-identity.principal_id}","${var.managed_identity_object_id}"]

}

data "azurerm_user_assigned_identity" "rpa-shared-identity" {
  name                = "rpa-${var.env}-mi"
  resource_group_name = "managed-identities-${var.env}-rg"
}

provider "vault" {
  address = "https://vault.reform.hmcts.net:6200"
}

data "azurerm_key_vault" "s2s_vault" {
  name = "s2s-${local.local_env}"
  resource_group_name = "rpe-service-auth-provider-${local.local_env}"
}

data "azurerm_key_vault" "shared_vault" {
  name = "rpa-${local.local_env}"
  resource_group_name = "rpa-${local.local_env}"
}

data "azurerm_key_vault" "local_key_vault" {
  name = module.local_key_vault.key_vault_name
  resource_group_name = module.local_key_vault.key_vault_name
}

data "azurerm_key_vault_secret" "s2s_key" {
  name      = "microservicekey-em-gw"
  key_vault_id = data.azurerm_key_vault.s2s_vault.id
}

//resource "azurerm_key_vault_secret" "local_s2s_key" {
//  name         = "microservicekey-em-gw"
//  value        = data.azurerm_key_vault_secret.s2s_key.value
//  key_vault_id = data.azurerm_key_vault.local_key_vault.id
//}

data "azurerm_key_vault_secret" "oauth2_secret" {
  name      = "show-oauth2-token"
  key_vault_id = data.azurerm_key_vault.shared_vault.id
}

//resource "azurerm_key_vault_secret" "local_oauth2_secret" {
//  name         = "show-oauth2-token"
//  value        = data.azurerm_key_vault_secret.oauth2_secret.value
//  key_vault_id = data.azurerm_key_vault.local_key_vault.id
//}

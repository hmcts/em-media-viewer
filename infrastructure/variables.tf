variable "reform_service_name" {
  default = "showcase"
}

variable "product" {
  description = "Showcase of Evidence Management team products"
}

variable "component" {}

variable "location" {
  default = "UK South"
}

variable "env" {
  description = "(Required) The environment in which to deploy the application infrastructure."
}

variable "ilbIp" {}

variable "subscription" {}

variable "common_tags" {
  type = map(string)
}

variable "enable_ase" {
  default = false
}

// CNP settings
variable "jenkins_AAD_objectId" {
  description = "(Required) The Azure AD object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies."
}

variable "tenant_id" {
  description = "(Required) The Azure Active Directory tenant ID that should be used for authenticating requests to the key vault. This is usually sourced from environemnt variables and not normally required to be specified."
}

variable "managed_identity_object_id" {
  default = ""
}

variable "additional_host_name" {}

variable "capacity" {
  default = "1"
}

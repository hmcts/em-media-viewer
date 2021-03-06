variable "product" {
  default = "em"
}

variable "component" {}

variable "location" {
  default = "UK South"
}

variable "env" {}

variable "tenant_id" {}

variable "jenkins_AAD_objectId" {
  description = "(Required) The Azure AD object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies."
}

variable "common_tags" {
  type = map(string)
}

variable "managed_identity_object_id" {
  default = ""
}

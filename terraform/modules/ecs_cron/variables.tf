variable "name" {
  type = string
}

variable "image" {
  type = string
}

variable "command" {
  type = list(string)
  default = []
}

variable "schedule" {
  type = string
}

variable "region" {
  type = string
}

variable "cpu" {
  type = number
  default = 256
}

variable "memory" {
  type = number
  default = 512
}

variable "account_id" {
  type = string
}

variable "assign_public_ip" {
  type = bool
  default = false
}

variable "subnets" {
  type = list(string)
  default = []
}

variable "cluster_arn" {
  type = string
}

variable "environment" {
  type = string
  default = "production"
}

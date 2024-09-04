variable "bucket_name" {
  type        = string
  description = "Bucket Name"
}

variable "bucket_tag_name" {
  type        = string
  description = "Value of the Bucket Name Tag"
}

variable "bucket_origin_id" {
  type        = string
  description = "Origin ID for cloudfront distribution"
}

variable "waf_ipset_name" {
  type        = string
  description = "Name of IPSet"
}

variable "waf_rule_name" {
  type        = string
  description = "Name of WAF RUle"
}


variable "waf_web_acl_name" {
  type        = string
  description = "Name of Web ACL"
}

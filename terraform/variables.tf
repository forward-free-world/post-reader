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

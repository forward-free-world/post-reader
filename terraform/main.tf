resource "aws_s3_bucket" "post_reader_s3_hosting" {
  bucket = var.bucket_name

  tags = {
    Name = var.bucket_tag_name
  }
}

resource "aws_s3_bucket_website_configuration" "post_reader_s3_hosting_website_config" {
  bucket = var.bucket_name

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_cloudfront_origin_access_identity" "post_reader_s3_hosting_oai" {
  comment = "Post Reader S3 Hosting OAI"
}

resource "aws_s3_bucket_policy" "post_reader_s3_cf_policy" {
  bucket = aws_s3_bucket.post_reader_s3_hosting.id
  policy = data.aws_iam_policy_document.data_post_reader_s3_cf_policy.json
}

data "aws_iam_policy_document" "data_post_reader_s3_cf_policy" {
  statement {
    sid = "1"
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.post_reader_s3_hosting_oai.iam_arn]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.post_reader_s3_hosting.arn}/*"
    ]
  }
}

resource "aws_cloudfront_distribution" "post_reader_s3_hosting_distribution" {
  origin {
    domain_name = aws_s3_bucket.post_reader_s3_hosting.bucket_regional_domain_name
    origin_id   = var.bucket_origin_id
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.post_reader_s3_hosting_oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Cloudfront distribution for Post Reader Website Bucket"
  default_root_object = "index.html"

  # aliases = ["mysite.example.com", "yoursite.example.com"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = var.bucket_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  tags = {
    Environment = "production"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

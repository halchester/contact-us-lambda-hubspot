module "lambda" {
  source        = "terraform-aws-modules/lambda/aws"
  version       = "5.2.0"
  function_name = "contact-us"
  architectures = ["arm64"]
  runtime       = "nodejs18.x"
  handler       = "index.handler"

  attach_policy_statements = true

  policy_statements = {
    AmazonSSMReadOnlyAccess = {
      sid       = "AmazonSSMReadOnlyAccess"
      effect    = "Allow"
      actions   = ["ssm:Describe*", "ssm:Get*", "ssm:List*"]
      resources = ["*"]
    }
  }

  source_path = [{
    path = "${path.module}/functions/contact-us"
  }]

  create_lambda_function_url = true

  cors = {
    allowed_credentials = false
    allowed_headers     = ["*"]
    allowed_methods     = ["POST", "OPTIONS", ]
    allowed_origins     = ["*"] # We would only want to allow our domain here
    max_age_seconds     = 3000
  }
}

Terraform configuration for aws deployment environment.

This can be run with:

```
terraform apply
```

Terraform state is saved in `epic-linkapp-terraform-state` s3 bucket.

If you've created new ec2 instances, you should run `deploy/initialize.py` script to install required dependencies on them.

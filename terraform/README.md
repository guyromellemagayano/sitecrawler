Terraform configuration for aws deployment environment.

To run terraform against postgres database you need to have port forwarding setup on localhost:5432. Something like this:

```
ssh -i deployer-backup.pem -L 5432:terraform-20200810173347645600000001.ceavi2ewfiqg.us-east-1.rds.amazonaws.com:5432 ubuntu@35.170.74.95
```

This can be run with:

```
terraform apply
```

Terraform state is saved in `epic-linkapp-terraform-state` s3 bucket.

If you've created new ec2 instances, you should run `deploy/initialize.py` script to install required dependencies on them.

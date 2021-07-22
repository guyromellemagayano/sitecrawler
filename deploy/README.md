# Deployment

Deploy scripts for deploying the app to aws environments.

## Deploying to staing

The `staing.py` script will first create aws security group exception for the running machine.

It gets ssh cert from `epic-linkapp-secrets` bucket.

Then it will use `fabric` to deploy to aws ec2 instances:

1. Copy `docker-compose.{env}.yml` to `docker-compose.yml` on the ec2.

2. Runs `docker-compose pull` and `docker-compose up -d`.


## Initializing machines

`initialize.py` script uses `fabric` to install required dependencies to ec2 instances.

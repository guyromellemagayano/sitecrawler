import io
import os

import boto3
from fabric import Connection
import paramiko
import requests


ec2 = boto3.resource("ec2")
client = boto3.client("ec2")
s3 = boto3.resource("s3")


def get_connections(**filters):
    pkey = get_ssh_cert()
    return [Connection(instance, user="ubuntu", connect_kwargs={"pkey": pkey}) for instance in get_instances(**filters)]


def getIngressConfig(group="node_security_group"):
    return {
        "CidrIp": requests.get("https://api.ipify.org").text + "/32",
        "FromPort": 22,
        "ToPort": 22,
        "GroupName": group,
        "IpProtocol": "tcp",
    }


def authorize_ingress(groups):
    for group in groups:
        ingress = getIngressConfig(group)
        try:
            client.authorize_security_group_ingress(**ingress)
        except Exception as e:
            if "InvalidPermission.Duplicate" not in str(e):
                raise


def revoke_ingress(groups):
    for group in groups:
        ingress = getIngressConfig(group)
        client.revoke_security_group_ingress(**ingress)


def get_ssh_cert():
    obj = s3.Object("epic-linkapp-secrets", "deployer.pem")
    body = obj.get()["Body"].read()
    return paramiko.RSAKey.from_private_key(io.StringIO(body.decode("utf-8")))


def get_instances(**filters):
    if not filters:
        instances = ec2.instances.all()
    else:
        filter_items = [{"Name": f"tag:{key}", "Values": [value]} for key, value in filters.items()]
        instances = ec2.instances.filter(Filters=filter_items)
    return [instance.public_dns_name for instance in instances]


def docker_compose(i, c, name):
    c.run("$(aws ecr get-login --no-include-email --region us-east-1)")

    c.run(f"mkdir -p {name}")

    numbered_compose = f"deploy/docker-compose.{name}.{i}.yml"
    if os.path.isfile(numbered_compose):
        c.put(numbered_compose, f"{name}/docker-compose.yml")
    else:
        c.put(f"deploy/docker-compose.{name}.yml", f"{name}/docker-compose.yml")

    c.run(f"aws s3 cp s3://epic-linkapp-secrets/secrets.{name}.yml {name}/docker-compose.override.yml")

    c.run(f"cd {name} && docker-compose pull")
    c.run(f"cd {name} && docker-compose up -d")

    c.run(f"cd {name} && docker-compose run backend ./manage.py migrate")

    c.run("docker system prune -f")

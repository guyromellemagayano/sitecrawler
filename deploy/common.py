import io

import boto3
from fabric import Connection
import paramiko
import requests


ec2 = boto3.resource("ec2")
client = boto3.client("ec2")
s3 = boto3.resource("s3")


def get_connections(name=None):
    pkey = get_ssh_cert()
    return [Connection(instance, user="ubuntu", connect_kwargs={"pkey": pkey}) for instance in get_instances(name)]


ingress = {
    "CidrIp": "",
    "FromPort": 22,
    "ToPort": 22,
    "GroupName": "node_security_group",
    "IpProtocol": "tcp",
}


def setCidrIp():
    ingress["CidrIp"] = requests.get("https://api.ipify.org").text + "/32"


def authorize_ingress():
    setCidrIp()
    try:
        client.authorize_security_group_ingress(**ingress)
    except Exception as e:
        if "InvalidPermission.Duplicate" not in str(e):
            raise


def revoke_ingress():
    setCidrIp()
    client.revoke_security_group_ingress(**ingress)


def get_ssh_cert():
    obj = s3.Object("epic-linkapp-secrets", "deployer.pem")
    body = obj.get()["Body"].read()
    return paramiko.RSAKey.from_private_key(io.StringIO(body.decode("utf-8")))


def get_instances(name=None):
    if name is None:
        instances = ec2.instances.all()
    else:
        instances = ec2.instances.filter(Filters=[{"Name": "tag:Name", "Values": [name]}])
    return [instance.public_dns_name for instance in instances]

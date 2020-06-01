import boto3
from fabric import Connection
import requests

ec2 = boto3.resource("ec2")
client = boto3.client("ec2")


def get_connections(name=None):
    return [
        Connection(instance, user="ubuntu", connect_kwargs={"key_filename": "deployer.pem"})
        for instance in get_instances(name)
    ]


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
    client.authorize_security_group_ingress(**ingress)


def revoke_ingress():
    setCidrIp()
    client.revoke_security_group_ingress(**ingress)


def get_instances(name=None):
    if name is None:
        instances = ec2.instances.all()
    else:
        instances = ec2.instances.filter(Filters=[{"Name": "tag:Name", "Values": [name]}])
    return [instance.public_dns_name for instance in instances]

import boto3
from fabric import Connection


def get_connections(name=None):
    return [
        Connection(instance, user="ubuntu", connect_kwargs={"key_filename": "deployer.pem"})
        for instance in get_instances(name)
    ]


def get_instances(name=None):
    ec2 = boto3.resource("ec2")
    if name is None:
        instances = ec2.instances.all()
    else:
        instances = ec2.instances.filter(Filters=[{"Name": "tag:Name", "Values": [name]}])
    return [instance.public_dns_name for instance in instances]

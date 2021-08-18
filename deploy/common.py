import time
import io
import os

import boto3
from fabric import Connection
import paramiko
import requests

secrets_bucket = "epic-linkapp-secrets"


ec2 = boto3.resource("ec2")
client = boto3.client("ec2")
s3 = boto3.resource("s3")
elbv2 = boto3.client("elbv2")


def get_connections(**filters):
    pkey = get_ssh_cert()
    return [Connection(instance, user="ubuntu", connect_kwargs={"pkey": pkey}) for instance in get_instances(**filters)]


def getMyIp():
    resp = requests.get("https://api.ipify.org")
    resp.raise_for_status()
    return resp.text


def getIngressConfig(group):
    return {
        "CidrIp": getMyIp() + "/32",
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
    obj = s3.Object(secrets_bucket, "deployer.pem")
    body = obj.get()["Body"].read()
    return paramiko.RSAKey.from_private_key(io.StringIO(body.decode("utf-8")))


def get_instances(**filters):
    if not filters:
        instances = ec2.instances.all()
    else:
        filter_items = [{"Name": f"tag:{key}", "Values": [value]} for key, value in filters.items()]
        instances = ec2.instances.filter(Filters=filter_items)
    return [instance.public_dns_name for instance in instances]


def add_to_load_balancer(dns):
    id = node_id_from_dns(dns)
    target_groups = elbv2.describe_target_groups()["TargetGroups"]
    for tg in target_groups:
        group_name = tg["TargetGroupName"]
        print(f"Adding {dns} to {group_name} load balancer")
        elbv2.register_targets(TargetGroupArn=tg["TargetGroupArn"], Targets=[{"Id": id}])

    for tg in target_groups:
        wait_for_target_group_state(tg, id, "healthy")


def remove_from_load_balancer(dns):
    id = node_id_from_dns(dns)
    target_groups = elbv2.describe_target_groups()["TargetGroups"]
    for tg in target_groups:
        group_name = tg["TargetGroupName"]
        verify_at_least_1_healthy_after_removal(tg["TargetGroupArn"], id)
        print(f"Removing {dns} from {group_name} load balancer")
        elbv2.deregister_targets(TargetGroupArn=tg["TargetGroupArn"], Targets=[{"Id": id}])

    for tg in target_groups:
        wait_for_target_group_state(tg, id, "unused")


def verify_at_least_1_healthy_after_removal(group_arn, id):
    result = elbv2.describe_target_health(TargetGroupArn=group_arn)["TargetHealthDescriptions"]
    healthy_after_removal = [x for x in result if x["TargetHealth"]["State"] == "healthy" and x["Target"]["Id"] != id]
    if len(healthy_after_removal) < 1:
        raise Exception("Not enough healthy nodes for deployment. Needs manual intervention!")


def wait_for_target_group_state(group, target_id, state):
    group_name = group["TargetGroupName"]
    for i in range(60):
        if get_target_group_state(group["TargetGroupArn"], target_id) == state:
            return
        print(f"Waiting for {target_id} to go {state} on {group_name} lb...")
        time.sleep(1)
    raise Exception(f"Timeout waiting for {target_id} to go {state}")


def get_target_group_state(group_arn, target_id):
    result = elbv2.describe_target_health(TargetGroupArn=group_arn, Targets=[{"Id": target_id}])[
        "TargetHealthDescriptions"
    ]
    if len(result) == 0:
        return "unused"
    return result[0]["TargetHealth"]["State"]


def node_id_from_dns(dns):
    instances = ec2.instances.all()
    for instance in instances:
        if instance.public_dns_name == dns:
            return instance.id


def docker_compose(i, c, name):
    c.run("$(aws ecr get-login --no-include-email --region us-east-1)")

    c.run(f"mkdir -p {name}")

    numbered_compose = f"deploy/docker-compose.{name}.{i}.yml"
    if os.path.isfile(numbered_compose):
        c.put(numbered_compose, f"{name}/docker-compose.yml")
    else:
        c.put(f"deploy/docker-compose.{name}.yml", f"{name}/docker-compose.yml")

    c.run(f"cd {name} && docker-compose pull")
    c.run(f"cd {name} && docker-compose up -d")

    c.run(f"cd {name} && docker-compose run backend ./manage.py migrate --database superuser")

    c.run("docker system prune -af")

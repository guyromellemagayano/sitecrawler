#!/usr/bin/env python3

import common

groups = ["node_security_group"]


def deploy(i, c):
    common.docker_compose(i, c, "staging")

    # deploy crontab only on staging
    c.put("deploy/crontab.staging", "staging/crontab")
    c.run("cd staging && crontab crontab")
    # pull images for crons
    c.run("docker pull 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-reverifier:staging")


common.authorize_ingress(groups)

for i, connection in enumerate(common.get_connections(Env="staging")):
    print(f"Deploying to {connection.host}")

    deploy(i, connection)


common.revoke_ingress(groups)

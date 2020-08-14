#!/usr/bin/env python3

import common

groups = ["node_security_group"]


def deploy(i, c):
    common.docker_compose(i, c, "staging")


common.authorize_ingress(groups)

for i, connection in enumerate(common.get_connections(Env="staging")):
    print(f"Deploying to {connection.host}")

    deploy(i, connection)


common.revoke_ingress(groups)

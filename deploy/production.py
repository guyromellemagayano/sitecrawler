#!/usr/bin/env python3

import common

groups = ["production_security_group"]


def deploy(i, c):
    common.docker_compose(i, c, "production")


common.authorize_ingress(groups)

for i, connection in enumerate(common.get_connections(Env="production")):
    print(f"Deploying to {connection.host}")

    deploy(i, connection)


common.revoke_ingress(groups)

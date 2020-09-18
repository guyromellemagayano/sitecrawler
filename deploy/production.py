#!/usr/bin/env python3
import time

import common

groups = ["production_security_group"]


def deploy(i, c):
    common.docker_compose(i, c, "production")


common.authorize_ingress(groups)

for i, connection in enumerate(common.get_connections(Env="production")):
    print(f"Deploying to {connection.host}")

    common.remove_from_load_balancer(connection.host)

    deploy(i, connection)

    time.sleep(10)

    common.add_to_load_balancer(connection.host)


common.revoke_ingress(groups)

#!/usr/bin/env python3

import common


def docker_compose(c, name):
    c.run("$(aws ecr get-login --no-include-email --region us-east-1)")

    c.run(f"mkdir -p {name}")
    c.put(f"deploy/docker-compose.{name}.yml", f"{name}/docker-compose.yml")
    c.run(f"aws s3 cp s3://epic-linkapp-secrets/secrets.{name}.yml {name}/docker-compose.override.yml")

    c.run(f"cd {name} && docker-compose pull")
    c.run(f"cd {name} && docker-compose up -d")


def deploy(c):
    docker_compose(c, "staging")


for connection in common.get_connections("Staging"):
    print(f"Deploying to {connection.host}")

    deploy(connection)

#!/usr/bin/env python3

import common


def build_image(c, name):
    image_name = f"400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-{name}"
    c.local(f"docker build -t {image_name} {name}/")
    c.local(f"docker push {image_name}")


def build(c):
    c.local("source environment && $(aws ecr get-login --no-include-email)")
    build_image(c, "backend")
    build_image(c, "frontend")
    build_image(c, "crawler")


def docker_compose(c, name):
    c.run("$(aws ecr get-login --no-include-email --region us-east-1)")

    c.run(f"mkdir -p {name}")
    c.put(f"deploy/docker-compose.{name}.yml", f"{name}/docker-compose.yml")
    c.run(f"aws s3 cp s3://epic-linkapp-secrets/secrets.{name}.yml {name}/docker-compose.override.yml")

    c.run(f"cd {name} && docker-compose pull")
    c.run(f"cd {name} && docker-compose up -d")


def deploy(c):
    build(c)
    docker_compose(c, "staging")


for connection in common.get_connections("Staging"):
    print(f"Deploying to {connection.host}")

    deploy(connection)

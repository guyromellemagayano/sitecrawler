#!/usr/bin/env python3

import common


def initialize(c):
    # docker
    c.sudo('bash -c "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -"')
    c.sudo('add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"')
    c.sudo("apt-get update")
    c.sudo("apt-get install docker-ce docker-ce-cli containerd.io")
    c.sudo("usermod -aG docker ubuntu")

    # docker-compose
    c.sudo(
        'curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose'
    )
    c.sudo("chmod +x /usr/local/bin/docker-compose")

    # awscli
    c.sudo("apt-get install awscli")


for connection in common.get_connections():
    print(f"Initialize {connection.host}")

    initialize(connection)

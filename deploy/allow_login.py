#!/usr/bin/env python3
import common

groups = ["production_security_group", "node_security_group"]


common.authorize_ingress(groups)

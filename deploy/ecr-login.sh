#!/bin/bash

set -e

$(aws ecr get-login --no-include-email)

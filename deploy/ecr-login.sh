#!/bin/bash

set -e

aws ecr get-login-password | docker login --username AWS --password-stdin 400936075989.dkr.ecr.us-east-1.amazonaws.com

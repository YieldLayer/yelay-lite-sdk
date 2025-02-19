#!/bin/bash

# This script replaces the version inside package.json
version=$1

sed -i "s/\"version\": \"[0-9]\+.[0-9]\+.[0-9]\+\"/\"version\": \"$version\"/" package.json

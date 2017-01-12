#!/bin/bash

webpack

export NODE_PATH=./lib:./app:./app/src:$NODE_PATH
node app/styler.js

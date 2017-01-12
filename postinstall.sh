#!/bin/bash

webpack
export NODE_PATH=./lib:./app:./app/src:$NODE_PATH
node --ignore '!*styles.js' app/styler.js

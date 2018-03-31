#!/bin/bash

`cp -a /Users/Tyler/Documents/Programming/Screeps/Lixar/. /Users/Tyler/Library/Application\ Support/Screeps/scripts/screeps_lixar_net___21025/default`
rsync -av --progress /Users/Tyler/Documents/Programming/Screeps/Lixar/. /Users/Tyler/Library/Application\ Support/Screeps/scripts/screeps_lixar_net___21025/default --exclude /.git/

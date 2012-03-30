#!/bin/bash

# Script to generate build the BrowserQuest

BUILDDIR="./server-build"
PROJECTDIR="./server"
SHAREDDIR="./shared"
CURDIR=$(pwd)


echo "Deleting previous build directory"
#rm -rf $BUILDDIR

echo "Building server"
#mkdir $BUILDDIR
cp -r $PROJECTDIR $BUILDDIR
cp -r $SHAREDDIR $BUILDDIR

cd $BUILDDIR/server
echo "Installing node modules"
npm install

cd ..

echo "Running server"
node server/js/main.js
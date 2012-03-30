#!/bin/bash

# Script to generate build the BrowserQuest

BUILDDIR="../client-node"
PROJECTDIR="../client"
SHAREDDIR="../shared"
CURDIR=$(pwd)


echo "Deleting previous build directory"
rm -rf $BUILDDIR

echo "Building server"
mkdir $BUILDDIR
cp -r $PROJECTDIR $BUILDDIR/client
cp -r $SHAREDDIR $BUILDDIR/client
cp ../app.js $BUILDDIR

cd $BUILDDIR

echo "Installing node modules"
npm install express

echo "Build complete"
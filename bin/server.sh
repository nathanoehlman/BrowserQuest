#!/bin/bash

# Script to generate build the BrowserQuest

BUILDDIR="../server-build"
PROJECTDIR="../server"
SHAREDDIR="../shared"
DEPLOYDIR="/development/projects/NathanOehlman/openshift/serverbq"
CURDIR=$(pwd)


echo "Deleting previous build directory"
rm -rf $BUILDDIR
rm -rf $DEPLOYDIR/server
rm -rf $DEPLOYDIR/shared

echo "Building server"
mkdir $BUILDDIR
cp -r $PROJECTDIR $BUILDDIR
cp -r $PROJECTDIR $DEPLOYDIR
cp -r $SHAREDDIR $BUILDDIR
cp -r $SHAREDDIR $DEPLOYDIR

echo "Copying to deploy location"
cp $PROJECTDIR/deplist.txt $DEPLOYDIR
rm $DEPLOYDIR/server/config_local.json

cd $BUILDDIR/server
echo "Installing node modules"
npm install

echo "Build complete"
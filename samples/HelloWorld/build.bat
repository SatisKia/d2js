@echo off

set CPP=gcc -E -P -x c -I..\..\..\core

cd src
%CPP% HelloWorld.js > ..\htdocs\HelloWorld.js
cd ..

pause

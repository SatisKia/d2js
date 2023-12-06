@echo off

set CPP=gcc -E -P -x c -I\HTML5\d2js\core

cd src
%CPP% Main.js > ..\htdocs\Main.js
cd ..

pause

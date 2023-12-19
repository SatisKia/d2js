@echo off

set CPP=gcc -E -P -x c -I.

cd src
%CPP% Main.js > ..\htdocs\Main.js
cd ..

pause

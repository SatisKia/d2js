@echo off

set CPP=C:\MinGW\bin\gcc -E -P -x c -I..\..\..\core

cd src
%CPP% Main.js > ..\htdocs\Main.js
cd ..

pause

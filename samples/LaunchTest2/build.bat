@echo off

set CPP=gcc -E -P -x c -I..\..\..\core

cd src
%CPP% Main.js > ..\htdocs\Main.js
%CPP% Sub.js > ..\htdocs\Sub.js
cd ..

pause

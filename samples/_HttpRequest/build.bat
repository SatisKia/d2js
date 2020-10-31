@echo off

set CPP=C:\MinGW\bin\gcc -E -P -x c -I..\..\..\core

cd src
%CPP% Main.js > ..\htdocs\Main.js
cd ..

copy ..\..\etc\_HttpRequest.js htdocs\HttpRequest.js
copy ..\..\etc\_json.php htdocs\json.php

pause

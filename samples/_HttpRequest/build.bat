@echo off

set CPP=gcc -E -P -x c -I..\..\..\core
rem set SKCOMMONPATH=C:\git\SatisKia\common

cd src
%CPP% Main.js > ..\htdocs\Main.js
cd ..

copy %SKCOMMONPATH%\_HttpRequest.js htdocs\HttpRequest.js
copy %SKCOMMONPATH%\_Json.js htdocs\Json.js
copy %SKCOMMONPATH%\_json.php htdocs\json.php

pause

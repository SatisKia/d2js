@echo off

set CPP=C:\MinGW\bin\gcc -E -P -x c -I..\..\..\core
set COMMON_PATH=C:\HTML5\common

cd src
%CPP% Main.js > ..\htdocs\Main.js
cd ..

copy %COMMON_PATH%\_Sensor.js htdocs\Sensor.js

pause

@echo off

set CPP=gcc -E -P -x c -I..\..\..\core

cd src
%CPP% Main.js > ..\htdocs\Main.js
cd ..

copy ..\..\core\extras\_Sensor.js htdocs\Sensor.js

pause

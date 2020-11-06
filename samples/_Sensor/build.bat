@echo off

set CPP=gcc -E -P -x c -I..\..\..\core
rem set SKCOMMONPATH=C:\git\SatisKia\common

cd src
%CPP% Main.js > ..\htdocs\Main.js
cd ..

copy %SKCOMMONPATH%\_Sensor.js htdocs\Sensor.js

pause

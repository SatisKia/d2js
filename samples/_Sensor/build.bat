@echo off

set CPP=gcc -E -P -x c -I..\..\..\core
rem set SKCOMMONPATH=C:\git\SatisKia\common
if "%SKCOMMONPATH%"=="" goto error

cd src
%CPP% Main.js > ..\htdocs\Main.js
cd ..

rem copy %SKCOMMONPATH%\_Sensor.js htdocs\Sensor.js
copy ..\..\core\_Sensor.js htdocs\Sensor.js

goto end

:error
echo 環境変数"SKCOMMONPATH"が設定されていません

:end
pause

@echo off

set CPP=gcc -E -P -x c -I..\..\..\core
rem set SKCOMMONPATH=C:\git\SatisKia\common
if "%SKCOMMONPATH%"=="" goto error

cd src
%CPP% Main.js > ..\htdocs\Main.js
cd ..

copy %SKCOMMONPATH%\_HttpRequest.js htdocs\HttpRequest.js
copy ..\..\core\_Json.js htdocs\Json.js
copy ..\..\core\_json.php htdocs\json.php

goto end

:error
echo 環境変数"SKCOMMONPATH"が設定されていません

:end
pause

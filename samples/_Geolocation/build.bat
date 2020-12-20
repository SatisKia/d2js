@echo off

set CPP=gcc -E -P -x c -I..\..\..\core
rem set AJAXMINPATH=C:\Microsoft Ajax Minifier
if "%AJAXMINPATH%"=="" goto error
rem set SKCOMMONPATH=C:\git\SatisKia\common
if "%SKCOMMONPATH%"=="" goto error

cd src
%CPP% Main.js > ..\htdocs\Main.js
cd ..

call "%AJAXMINPATH%\AjaxMinCommandPromptVars"
cd htdocs
del Main.min.js
AjaxMin -enc:in UTF-8 Main.js -out Main.min.js
cd ..

copy %SKCOMMONPATH%\_Geolocation.js htdocs\Geolocation.js

goto end

:error
echo 環境変数"AJAXMINPATH"または"SKCOMMONPATH"が設定されていません

:end
pause

@echo off

set CPP=gcc -E -P -x c -I..\..\..\core
rem set AJAXMINPATH=C:\Microsoft Ajax Minifier
rem set SKCOMMONPATH=C:\git\SatisKia\common

cd src
%CPP% Main.js > ..\htdocs\Main.js
cd ..

call "%AJAXMINPATH%\AjaxMinCommandPromptVars"
cd htdocs
del Main.min.js
AjaxMin -enc:in UTF-8 Main.js -out Main.min.js
cd ..

copy %SKCOMMONPATH%\_NativeRequest.js htdocs\NativeRequest.js

pause

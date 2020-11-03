@echo off

set CPP=C:\MinGW\bin\gcc -E -P -x c -I. -I..\..\tank\src -I..\..\..\core
set COMMON_PATH=C:\HTML5\common

cd src
%CPP% Main.js > ..\htdocs\Main.js
cd ..

call "C:\HTML5\Microsoft Ajax Minifier\AjaxMinCommandPromptVars"
cd htdocs
del Main.min.js
AjaxMin -enc:in UTF-8 Main.js -out Main.min.js
cd ..

copy %COMMON_PATH%\_Cookie.js htdocs\Cookie.js

pause

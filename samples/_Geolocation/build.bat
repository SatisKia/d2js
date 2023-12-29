@echo off

set CPP=gcc -E -P -x c -I..\..\..\core
rem set AJAXMINPATH=C:\Microsoft Ajax Minifier
if "%AJAXMINPATH%"=="" goto error

cd src
%CPP% Main.js > ..\htdocs\Main.js
cd ..

call "%AJAXMINPATH%\AjaxMinCommandPromptVars"
cd htdocs
del Main.min.js
AjaxMin -enc:in UTF-8 Main.js -out Main.min.js
cd ..

copy ..\..\core\extras\_Geolocation.js htdocs\Geolocation.js

goto end

:error
echo 環境変数"AJAXMINPATH"が設定されていません

:end
pause

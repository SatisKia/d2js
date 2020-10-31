@echo off

set CPP=C:\MinGW\bin\gcc -E -P -x c -I..\..\..\core

cd src
..\..\..\tools\image2js image.txt image_id.js image.js
%CPP% Main.js > ..\htdocs\Main.js
cd ..

call "C:\HTML5\Microsoft Ajax Minifier\AjaxMinCommandPromptVars"
cd htdocs
del Main.min.js
AjaxMin -enc:in UTF-8 Main.js -out Main.min.js
cd ..

copy ..\..\etc\_Cookie.js htdocs\Cookie.js

pause

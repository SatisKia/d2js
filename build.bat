@echo off

set CPP=gcc -E -P -x c
rem set AJAXMINPATH=C:\Microsoft Ajax Minifier

md tmp

cd core
%CPP% _Main.js _Audio.js _Button.js _Graphics.js _ScalableGraphics.js _Image.js _Layout.js _Math.js _Random.js _System.js _Vector.js > ..\tmp\tmp1.js
cd ..

function tmp\tmp1.js tmp\function.js

define core\_Global.h tmp\define.js

string tmp\tmp1.js tmp\string.js tmp\strrep.bat strrep 1 1
call tmp\strrep.bat > tmp\tmp2.js

%CPP% d2js.js | format > tmp\d2js.debug.js
%CPP% -DMINIFIED d2js.js | format > tmp\tmp3.js

call "%AJAXMINPATH%\AjaxMinCommandPromptVars"
cd tmp
del d2js.js
AjaxMin -enc:in UTF-8 tmp3.js -out d2js.js
cd ..

copy /B head.txt+tmp\d2js.debug.js core\d2js.debug.js
copy /B head.txt+tmp\d2js.js       core\d2js.js

pause

@echo off

set CPP=C:\MinGW\bin\gcc -E -P -x c

md tmp

cd core
%CPP% _Main.js _Audio.js _Button.js _Graphics.js _ScalableGraphics.js _Image.js _Layout.js _Math.js _Random.js _System.js _Vector.js > ..\tmp\tmp1.js
cd ..

function tmp\tmp1.js tmp\function.js

define core\_Global.h tmp\define.js

cd tmp
..\string tmp1.js string.js strrep.bat ..\strrep 1 1
call strrep.bat > tmp2.js
cd ..

%CPP% d2js.js | format > tmp\d2js.debug.js
%CPP% -DMINIFIED d2js.js | format > tmp\tmp3.js

call "C:\HTML5\Microsoft Ajax Minifier\AjaxMinCommandPromptVars"
cd tmp
del d2js.js
AjaxMin -enc:in UTF-8 tmp3.js -out d2js.js
cd ..

copy /B head.txt+tmp\d2js.debug.js core\d2js.debug.js
copy /B head.txt+tmp\d2js.js       core\d2js.js

pause

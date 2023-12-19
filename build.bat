@echo off

set CPP=gcc -E -P -x c
set TMP=tmp\core
rem set AJAXMINPATH=C:\Microsoft Ajax Minifier
if "%AJAXMINPATH%"=="" goto error

md %TMP%

cd core
%CPP% _Main.js _Audio.js _Button.js _Graphics.js _ScalableGraphics.js _Image.js _Layout.js _Math.js _Random.js _System.js _Vector.js > ..\%TMP%\tmp1.js
cd ..

function %TMP%\tmp1.js %TMP%\function.js

define core\_Global.h %TMP%\define.js

string %TMP%\tmp1.js %TMP%\string.js %TMP%\strrep.bat strrep 1 1
call %TMP%\strrep.bat > %TMP%\tmp2.js

%CPP% d2js.js | format > %TMP%\d2js.debug.js
%CPP% -DMINIFIED d2js.js | format > %TMP%\tmp3.js

call "%AJAXMINPATH%\AjaxMinCommandPromptVars"
del %TMP%\d2js.js
AjaxMin -enc:in UTF-8 %TMP%\tmp3.js -out %TMP%\d2js.js

copy /B head.txt+%TMP%\d2js.debug.js core\d2js.debug.js
copy /B head.txt+%TMP%\d2js.js       core\d2js.js

goto end

:error
echo 環境変数"AJAXMINPATH"が設定されていません

:end
pause

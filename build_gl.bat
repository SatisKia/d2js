@echo off

set CPP=gcc -E -P -x c
set TMP=tmp\gl
rem set AJAXMINPATH=C:\Microsoft Ajax Minifier
if "%AJAXMINPATH%"=="" goto error

md %TMP%

cd core\gl
%CPP% _GLDraw.js _GLMain.js _GLModel.js _GLPrimitive.js _GLShader.js _GLSprite.js _GLTexture.js _GLTriangle.js _GLUtility.js > ..\..\%TMP%\tmp1.js
cd ..\..

function %TMP%\tmp1.js %TMP%\function.js

define core\gl\_GLPrimitive.h %TMP%\define.js

string %TMP%\tmp1.js %TMP%\string.js %TMP%\strrep.bat strrep 1 1
call %TMP%\strrep.bat > %TMP%\tmp2.js

%CPP% d2js_gl.js | format > %TMP%\d2js_gl.debug.js
%CPP% -DMINIFIED d2js_gl.js | format > %TMP%\tmp3.js

call "%AJAXMINPATH%\AjaxMinCommandPromptVars"
del %TMP%\d2js_gl.js
AjaxMin -enc:in UTF-8 %TMP%\tmp3.js -out %TMP%\d2js_gl.js

copy /B head.txt+%TMP%\d2js_gl.debug.js core\gl\d2js_gl.debug.js
copy /B head.txt+%TMP%\d2js_gl.js       core\gl\d2js_gl.js

goto end

:error
echo 環境変数"AJAXMINPATH"が設定されていません

:end
pause

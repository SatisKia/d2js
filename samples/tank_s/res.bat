@echo off

..\..\tools\image2html image.txt res/ src\image.js image.html

copy /B index_0.html+image.html+index_1.html htdocs\index.html

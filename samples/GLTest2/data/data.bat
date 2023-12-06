md tmp

certutil -f -encode sample.png tmp\1.txt

type tmp\1.txt | ..\..\..\tools\dataurl png > ..\src\data.txt

pause

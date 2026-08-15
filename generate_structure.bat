@echo off
echo Generation de la structure du projet...

if not exist Infos mkdir Infos

tree /F /A > Infos\structure_temp.txt

powershell -NoProfile -Command "$nomProjet = Split-Path '%CD%' -Leaf; (Get-Content 'Infos\structure_temp.txt') -replace '^C:\.$', ('C:.\' + $nomProjet) | Set-Content 'Infos\structure.txt'"

del Infos\structure_temp.txt

echo Structure mise a jour !
pause
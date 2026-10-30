@echo off
echo Generation de la structure (Fichiers puis Dossiers)...

if exist "Infos_Structure\structure.txt" del "Infos_Structure\structure.txt"
if not exist Infos_Structure mkdir Infos_Structure

powershell -NoProfile -Command ^
    "$nomProjet = Split-Path '%CD%' -Leaf;" ^
    "function Show-Tree($path, $indent='') {" ^
    "    $items = Get-ChildItem $path | Sort-Object PSIsContainer, Name;" ^
    "    for ($i = 0; $i -lt $items.Count; $i++) {" ^
    "        $item = $items[$i];" ^
    "        $isLast = ($i -eq ($items.Count - 1));" ^
    "        if ($item.PSIsContainer) {" ^
    "            $junction = if ($isLast) { '\---' } else { '+---' };" ^
    "            $indent + $junction + $item.Name;" ^
    "            if ($item.Name -notmatch '^(src-tauri|node_modules|\.git|\.next|vendor|Infos_Structure)$') {" ^
    "                $suffixe = if ($isLast) { '    ' } else { '|   ' };" ^
    "                Show-Tree $item.FullName ($indent + $suffixe);" ^
    "            }" ^
    "        } else {" ^
    "            $junction = if ($isLast) { '\---' } else { '|   ' };" ^
    "            $indent + $junction + $item.Name;" ^
    "        }" ^
    "    }" ^
    "};" ^
    "$rootStr = 'C:.\' + $nomProjet;" ^
    "@($rootStr; Show-Tree '.') | Set-Content 'Infos_Structure\structure.txt' -Encoding utf8"

echo Structure mise a jour proprement dans Infos_Structure\structure.txt !
pause

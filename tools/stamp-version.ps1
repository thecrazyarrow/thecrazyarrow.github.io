# ============================================================
# tools/stamp-version.ps1 : makes every visitor get the newest CSS/JS
# right after a deploy, instead of a copy their browser saved earlier.
#
# It adds (or updates) a version number on the file links in every page:
#     assets/css/site.css?v=202611201945
# A new number = a "new" file to the browser, so it downloads it fresh.
# Run it before each push:
#     powershell -ExecutionPolicy Bypass -File tools\stamp-version.ps1
# ============================================================
$root = Split-Path -Parent $PSScriptRoot
$stamp = (Get-Date).ToString('yyyyMMddHHmm')
$utf8 = New-Object Text.UTF8Encoding $false
foreach ($f in Get-ChildItem $root -Filter *.html -File) {
  $s = [IO.File]::ReadAllText($f.FullName, $utf8)
  $new = [regex]::Replace($s, '(assets/(?:css/site\.css|js/site\.js|js/viewer\.js))(\?v=\d+)?"', "`$1?v=$stamp`"")
  if ($new -ne $s) { [IO.File]::WriteAllText($f.FullName, $new, $utf8); Write-Host "  stamped $($f.Name)" }
}
Write-Host "Version: $stamp"

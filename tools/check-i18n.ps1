# tools/check-i18n.ps1 : checks the translation files are valid and lists
# any English keys that Japanese or Arabic don't have yet.
#     powershell -ExecutionPolicy Bypass -File tools\check-i18n.ps1
# Keys ending in ".value" or ".numbers" are fine to skip: those reuse English.
$dir = Join-Path (Split-Path -Parent $PSScriptRoot) 'assets\i18n'
$utf8 = New-Object Text.UTF8Encoding $false
function Keys($code) {
  $obj = [IO.File]::ReadAllText((Join-Path $dir "$code.json"), $utf8) | ConvertFrom-Json
  @($obj.PSObject.Properties.Name | Where-Object { $_ -notlike '_*' })
}
$en = Keys 'en'
Write-Host "en.json: $($en.Count) keys"
foreach ($code in 'ja', 'ar') {
  $k = Keys $code
  $missing = @($en | Where-Object { $k -notcontains $_ -and $_ -notmatch '\.(value|numbers)$' })
  $extra = @($k | Where-Object { $en -notcontains $_ })
  Write-Host "$code.json: $($k.Count) keys, missing $($missing.Count), unknown $($extra.Count)"
  $missing | ForEach-Object { Write-Host "  missing: $_" }
  $extra | ForEach-Object { Write-Host "  unknown: $_" }
}

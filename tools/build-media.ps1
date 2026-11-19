# ============================================================
# tools/build-media.ps1 : same job as build-media.js, for Windows
# without Node.js installed. (It just doesn't make .webp copies.)
#
# Run it from the portfolio folder:
#     powershell -ExecutionPolicy Bypass -File tools\build-media.ps1
# ============================================================

$root = Split-Path -Parent $PSScriptRoot
Add-Type -AssemblyName System.Drawing   # to read each photo's width and height
$imageTypes = '.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'
$videoTypes = '.mp4', '.webm', '.mov'

# Natural sort (2.jpg before 10.jpg): pad every number in the name to 10 digits
function NaturalKey($name) { [regex]::Replace($name.ToLower(), '\d+', { $args[0].Value.PadLeft(10, '0') }) }
function WebPath($full) { $full.Substring($root.Length + 1).Replace('\', '/') }

$folders = [ordered]@{}
foreach ($start in 'zynx', 'assets\images') {
  $dir = Join-Path $root $start
  if (-not (Test-Path $dir)) { continue }
  $all = @(Get-Item $dir) + @(Get-ChildItem $dir -Recurse -Directory | Where-Object { $_.Name -notmatch '^[_.]' })
  foreach ($d in $all) {
    $files = @(Get-ChildItem $d.FullName -File | Where-Object { $imageTypes -contains $_.Extension.ToLower() } |
      Sort-Object { NaturalKey $_.Name })
    $list = @()
    foreach ($f in $files) {
      $isWebp = $f.Extension.ToLower() -eq '.webp'
      $twin = $files | Where-Object { $_.FullName -ne $f.FullName -and $_.BaseName -eq $f.BaseName }
      if ($isWebp -and $twin) { continue }   # a .webp copy of another photo, not its own photo
      $entry = [ordered]@{ src = (WebPath $f.FullName) }
      $webp = Join-Path $d.FullName ($f.BaseName + '.webp')
      if (-not $isWebp -and (Test-Path $webp)) { $entry.webp = WebPath $webp }
      # Width and height, so galleries can lay photos out at their real shape before they load.
      # Phone photos can be stored sideways with an "orientation" tag (EXIF 0x0112); 5-8 = turned 90°.
      try {
        $img = [System.Drawing.Image]::FromFile($f.FullName)
        $w = $img.Width; $h = $img.Height
        if ($img.PropertyIdList -contains 0x0112) {
          $o = [BitConverter]::ToUInt16($img.GetPropertyItem(0x0112).Value, 0)
          if ($o -ge 5 -and $o -le 8) { $w, $h = $h, $w }
        }
        $img.Dispose()
        $entry.w = $w; $entry.h = $h
      } catch { }   # .webp/.avif can't be read here; the site measures those itself
      $list += $entry
    }
    $folders[(WebPath $d.FullName)] = $list
    if ($list.Count) { Write-Host ("  {0}: {1} photo(s)" -f (WebPath $d.FullName), $list.Count) }
  }
}

$videos = @()
$videoDir = Join-Path $root 'assets\video'
if (Test-Path $videoDir) {
  $videos = @(Get-ChildItem $videoDir -File | Where-Object { $videoTypes -contains $_.Extension.ToLower() } |
    Sort-Object { NaturalKey $_.Name } | ForEach-Object { 'assets/video/' + $_.Name })
}
$logo = $null
if (Test-Path (Join-Path $root 'assets\logo\logo.svg')) { $logo = 'assets/logo/logo.svg' }

# ConvertTo-Json turns a 0- or 1-item list into something else, so build the JSON by hand
function J($v) { ($v | ConvertTo-Json -Compress) }
$lines = @()
foreach ($k in $folders.Keys) {
  $items = @($folders[$k] | ForEach-Object { J $_ }) -join ', '
  $lines += "    $(J $k): [$items]"
}
$vids = @($videos | ForEach-Object { J $_ }) -join ', '
$json = "{`n  ""generated"": $(J (Get-Date).ToUniversalTime().ToString('o')),`n  ""logo"": $(if ($logo) { J $logo } else { 'null' }),`n  ""folders"": {`n" + ($lines -join ",`n") + "`n  },`n  ""videos"": [$vids]`n}`n"

[IO.File]::WriteAllText((Join-Path $root 'assets\media.json'), $json, (New-Object Text.UTF8Encoding $false))
Write-Host ("Wrote assets/media.json ({0} video(s), logo: {1})" -f $videos.Count, $(if ($logo) { 'yes' } else { 'not yet' }))

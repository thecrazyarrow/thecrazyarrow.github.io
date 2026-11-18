# tools/make-og-image.ps1 : draws assets/og-image.png (1200x630), the picture
# shown when someone shares a link to the site. Run again after editing.
#     powershell -ExecutionPolicy Bypass -File tools\make-og-image.ps1
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$W = 1200; $H = 630
$bmp = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'; $g.TextRenderingHint = 'AntiAliasGridFit'

$black = [System.Drawing.ColorTranslator]::FromHtml('#0b0907')
$orange  = [System.Drawing.ColorTranslator]::FromHtml('#ff7a1a')
$light = [System.Drawing.ColorTranslator]::FromHtml('#ffa552')
$text  = [System.Drawing.ColorTranslator]::FromHtml('#f5ebe0')
$muted = [System.Drawing.ColorTranslator]::FromHtml('#a8927e')
$line  = [System.Drawing.ColorTranslator]::FromHtml('#4a2e18')
$g.Clear($black)

# soft orange glow on the right
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse(640, -120, 760, 760)
$glow = New-Object System.Drawing.Drawing2D.PathGradientBrush $path
$glow.CenterColor = [System.Drawing.Color]::FromArgb(80, 255, 122, 26)
$glow.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 11, 9, 7))
$g.FillPath($glow, $path)

# thin frame
$g.DrawRectangle((New-Object System.Drawing.Pen $line, 2), 28, 28, $W - 56, $H - 56)

function Txt($s, $font, $size, $style, $color, $x, $y) {
  $f = New-Object System.Drawing.Font $font, $size, ([System.Drawing.FontStyle]$style), ([System.Drawing.GraphicsUnit]::Pixel)
  $g.DrawString($s, $f, (New-Object System.Drawing.SolidBrush $color), $x, $y)
}
$dot = [string][char]0x00B7   # the middle dot, written as a code so the file encoding can't garble it
Txt "BASED IN KUWAIT  $dot  ALWAYS BUILDING" 'Consolas' 22 'Regular' $orange 80 120
Txt 'Aaron Angel Netto' 'Segoe UI' 92 'Bold' $text 70 170
Txt "Engineer  $dot  Maker  $dot  Creator" 'Segoe UI' 40 'Regular' $light 78 300
$g.FillRectangle((New-Object System.Drawing.SolidBrush $orange), 82, 395, 90, 4)
Txt 'engineered by chaos' 'Consolas' 30 'Regular' $orange 80 430
Txt 'the crazy arrow' 'Consolas' 20 'Regular' $muted 82 478

$out = Join-Path $root 'assets\og-image.png'
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Host "Wrote $out"

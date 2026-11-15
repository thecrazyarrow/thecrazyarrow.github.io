# tools/make-og-image.ps1 : draws assets/og-image.png (1200x630), the picture
# shown when someone shares a link to the site. Run again after editing.
#     powershell -ExecutionPolicy Bypass -File tools\make-og-image.ps1
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$W = 1200; $H = 630
$bmp = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'; $g.TextRenderingHint = 'AntiAliasGridFit'

$black = [System.Drawing.ColorTranslator]::FromHtml('#0b0a08')
$gold  = [System.Drawing.ColorTranslator]::FromHtml('#d4a84b')
$light = [System.Drawing.ColorTranslator]::FromHtml('#e8c87a')
$text  = [System.Drawing.ColorTranslator]::FromHtml('#f3ead7')
$muted = [System.Drawing.ColorTranslator]::FromHtml('#a8987a')
$line  = [System.Drawing.ColorTranslator]::FromHtml('#4a3c20')
$g.Clear($black)

# soft gold glow on the right
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse(640, -120, 760, 760)
$glow = New-Object System.Drawing.Drawing2D.PathGradientBrush $path
$glow.CenterColor = [System.Drawing.Color]::FromArgb(70, 212, 168, 75)
$glow.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 11, 10, 8))
$g.FillPath($glow, $path)

# thin frame
$g.DrawRectangle((New-Object System.Drawing.Pen $line, 2), 28, 28, $W - 56, $H - 56)

function Txt($s, $font, $size, $style, $color, $x, $y) {
  $f = New-Object System.Drawing.Font $font, $size, ([System.Drawing.FontStyle]$style), ([System.Drawing.GraphicsUnit]::Pixel)
  $g.DrawString($s, $f, (New-Object System.Drawing.SolidBrush $color), $x, $y)
}
$dot = [string][char]0x00B7   # the middle dot, written as a code so the file encoding can't garble it
Txt "KUWAIT  $dot  OPEN TO OPPORTUNITIES IN JAPAN" 'Consolas' 22 'Regular' $gold 80 120
Txt 'Aaron Angel Netto' 'Segoe UI' 92 'Bold' $text 70 170
Txt "Engineer  $dot  Maker  $dot  Creator" 'Segoe UI' 40 'Regular' $light 78 300
$g.FillRectangle((New-Object System.Drawing.SolidBrush $gold), 82, 395, 90, 4)
Txt 'engineered by chaos' 'Consolas' 30 'Regular' $gold 80 430
Txt 'the crazy arrow' 'Consolas' 20 'Regular' $muted 82 478

$out = Join-Path $root 'assets\og-image.png'
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Host "Wrote $out"

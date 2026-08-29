param(
  [Parameter(Mandatory=$true)][string]$Source,
  [Parameter(Mandatory=$true)][string]$Output
)

Add-Type -AssemblyName System.Drawing

$canvas = New-Object System.Drawing.Bitmap 2560, 1440
$canvas.SetResolution(96, 96)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$sourceImage = [System.Drawing.Image]::FromFile((Resolve-Path -LiteralPath $Source))

try {
  # Full-bleed decorative background.
  $g.DrawImage($sourceImage, (New-Object System.Drawing.Rectangle 0, 0, 2560, 1440))
  $wash = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(118, 6, 30, 76))
  $g.FillRectangle($wash, 0, 0, 2560, 1440)

  # Exact YouTube safe area: x=507..2053, y=509..932.
  $safePath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $safeRect = New-Object System.Drawing.Rectangle 507, 509, 1546, 423
  $radius = 44
  $diameter = $radius * 2
  $safePath.AddArc($safeRect.X, $safeRect.Y, $diameter, $diameter, 180, 90)
  $safePath.AddArc($safeRect.Right - $diameter, $safeRect.Y, $diameter, $diameter, 270, 90)
  $safePath.AddArc($safeRect.Right - $diameter, $safeRect.Bottom - $diameter, $diameter, $diameter, 0, 90)
  $safePath.AddArc($safeRect.X, $safeRect.Bottom - $diameter, $diameter, $diameter, 90, 90)
  $safePath.CloseFigure()
  $panel = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(242, 255, 252, 244))
  $g.FillPath($panel, $safePath)
  $outline = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(210, 255, 183, 0), 8)
  $g.DrawPath($outline, $safePath)

  function Draw-Avatar([System.Drawing.Graphics]$graphics, [System.Drawing.Image]$image, [System.Drawing.Rectangle]$sourceRect, [System.Drawing.Rectangle]$destRect) {
    $state = $graphics.Save()
    $clip = New-Object System.Drawing.Drawing2D.GraphicsPath
    $clip.AddEllipse($destRect)
    $graphics.SetClip($clip)
    $graphics.DrawImage($image, $destRect, $sourceRect, [System.Drawing.GraphicsUnit]::Pixel)
    $graphics.Restore($state)
    $avatarOutline = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 15, 61, 132)), 9
    $graphics.DrawEllipse($avatarOutline, $destRect)
    $avatarOutline.Dispose()
    $clip.Dispose()
  }

  # Portrait crops from the generated reference, kept completely inside the safe area.
  Draw-Avatar $g $sourceImage (New-Object System.Drawing.Rectangle 0, 210, 560, 610) (New-Object System.Drawing.Rectangle 540, 536, 365, 365)
  Draw-Avatar $g $sourceImage (New-Object System.Drawing.Rectangle 1160, 190, 512, 610) (New-Object System.Drawing.Rectangle 1655, 536, 365, 365)

  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $format.FormatFlags = [System.Drawing.StringFormatFlags]::NoWrap

  $fontName = "Yu Gothic"
  $font = New-Object System.Drawing.Font($fontName, 72, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel))
  $titleRect = New-Object System.Drawing.RectangleF 900, 580, 760, 200
  $shadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(45, 0, 0, 0))
  $black = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 20, 20, 24))
  $blue = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 18, 78, 190))

  $shadowRect = New-Object System.Drawing.RectangleF 904, 584, 760, 200
  # Build Japanese text from Unicode code points so Windows PowerShell 5.1
  # cannot reinterpret a UTF-8 script file as a legacy code page.
  $line1 = "AI" + [char]0x306E + [char]0x30E0 + [char]0x30C0 + [char]0x3065 + [char]0x304B + [char]0x3044
  $line2 = [char]0x30C1 + [char]0x30E3 + [char]0x30F3 + [char]0x30CD + [char]0x30EB
  $title = $line1 + [Environment]::NewLine + $line2
  $g.DrawString($title, $font, $shadow, $shadowRect, $format)
  $g.DrawString($title, $font, $black, $titleRect, $format)

  # Blue accent underline, safely inside the central panel.
  $accent = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 18, 78, 190)), 10
  $accent.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $accent.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $g.DrawLine($accent, 1030, 842, 1528, 842)

  $outputDir = Split-Path -Parent $Output
  if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
  }
  $canvas.Save($Output, [System.Drawing.Imaging.ImageFormat]::Png)
}
finally {
  $sourceImage.Dispose()
  $g.Dispose()
  $canvas.Dispose()
}

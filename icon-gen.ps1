Add-Type -AssemblyName System.Drawing

function New-Icon {
    param($path, $size)
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $color = [System.Drawing.Color]::FromArgb(255, 30, 30, 30)
    $brush = New-Object System.Drawing.SolidBrush($color)
    $g.FillRectangle($brush, 0, 0, $size, $size)
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

New-Icon "public\icon-192.png" 192
New-Icon "public\icon-512.png" 512

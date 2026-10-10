# Download Gulab Jamun
$gulabUrl = "https://upload.wikimedia.org/wikipedia/commons/5/56/Gulab_Jamun.jpg"
Write-Host "Downloading Gulab Jamun..."
Invoke-WebRequest -Uri $gulabUrl -OutFile "temp_gulab.jpg" -UserAgent "Mozilla/5.0"

# Convert to WebP
$cwebp = ".\tools\libwebp-1.4.0-windows-x64\bin\cwebp.exe"
if (Test-Path "temp_gulab.jpg") {
    & $cwebp -q 85 "temp_gulab.jpg" -o "images\gulab-jamun.webp"
    Remove-Item "temp_gulab.jpg" -Force
    Write-Host "Converted Gulab Jamun to WebP successfully!"
}

# Download Children on Swings in Park
$swingUrl = "https://upload.wikimedia.org/wikipedia/commons/a/a5/Children_playing_and_laughing_on_a_swing_01.png"
Write-Host "Downloading Children playing on swing..."
Invoke-WebRequest -Uri $swingUrl -OutFile "temp_swing.png" -UserAgent "Mozilla/5.0"

if (Test-Path "temp_swing.png") {
    & $cwebp -q 85 "temp_swing.png" -o "images\kids-play-zone.webp"
    Remove-Item "temp_swing.png" -Force
    Write-Host "Converted Kids on Swings to WebP successfully!"
}

Get-Item "images\gulab-jamun.webp", "images\kids-play-zone.webp" | Select-Object Name, Length

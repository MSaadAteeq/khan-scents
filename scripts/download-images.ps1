# Downloads perfume placeholder images into client/public/images
$base = Join-Path $PSScriptRoot "..\client\public\images"
$dirs = @("products", "categories", "social")
foreach ($d in $dirs) { New-Item -ItemType Directory -Force -Path (Join-Path $base $d) | Out-Null }

$pexels = "https://images.pexels.com/photos/{0}/pexels-photo-{0}.jpeg?auto=compress&cs=tinysrgb&w=800"
$pexelsLg = "https://images.pexels.com/photos/{0}/pexels-photo-{0}.jpeg?auto=compress&cs=tinysrgb&w=1600"

function Save-Image($id, $outPath) {
  $url = $pexels -f $id
  Write-Host "Downloading $outPath ..."
  Invoke-WebRequest -Uri $url -OutFile $outPath -UseBasicParsing
}

$pairs = @{
  "blue-intense"    = @(965989, 336372)
  "velvet-noir"     = @(1103909, 2849735)
  "silver-mist"     = @(1180669, 301784)
  "rose-absolu"     = @(1373714, 3993446)
  "amber-dusk"      = @(6728390, 6958692)
  "citrus-veil"     = @(6069330, 5827917)
  "soft-petal"      = @(2983464, 1462630)
  "midnight-ember"  = @(5827885, 4473396)
  "crystal-bloom"   = @(18126404, 18126408)
  "iron-cedar"      = @(965990, 3993444)
  "pure-blanc"      = @(3993439, 3993442)
  "golden-spire"    = @(3993448, 3993450)
}

foreach ($slug in $pairs.Keys) {
  $ids = $pairs[$slug]
  Save-Image $ids[0] (Join-Path $base "products\$slug-1.jpg")
  Save-Image $ids[1] (Join-Path $base "products\$slug-2.jpg")
}

Save-Image 965989 (Join-Path $base "products\fallback.jpg")
# Category tiles and about-bg are custom perfume photos — do not overwrite with stock Pexels IDs.

# Social tiles are custom Facebook / Instagram photos — do not overwrite.

$videoDir = Join-Path $PSScriptRoot "..\client\public\videos"
New-Item -ItemType Directory -Force -Path $videoDir | Out-Null
Write-Host "Downloading hero video..."
Invoke-WebRequest -Uri "https://assets.mixkit.co/videos/20766/20766-720.mp4" -OutFile (Join-Path $videoDir "hero.mp4") -UseBasicParsing
Invoke-WebRequest -Uri "https://assets.mixkit.co/videos/20766/20766-thumb-720-0.jpg" -OutFile (Join-Path $base "hero-poster.jpg") -UseBasicParsing

Write-Host "Done."

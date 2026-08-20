# Ensures every image path in the manifest exists on disk (copies fallback if missing).
$root = Join-Path $PSScriptRoot "..\client\public"
$fallback = Join-Path $root "images\products\fallback.jpg"

if (-not (Test-Path $fallback)) {
  Write-Error "Run download-images.ps1 first or add images/products/fallback.jpg"
  exit 1
}

$required = @(
  "images\products\blue-intense-1.jpg", "images\products\blue-intense-2.jpg",
  "images\products\velvet-noir-1.jpg", "images\products\velvet-noir-2.jpg",
  "images\products\silver-mist-1.jpg", "images\products\silver-mist-2.jpg",
  "images\products\rose-absolu-1.jpg", "images\products\rose-absolu-2.jpg",
  "images\products\amber-dusk-1.jpg", "images\products\amber-dusk-2.jpg",
  "images\products\citrus-veil-1.jpg", "images\products\citrus-veil-2.jpg",
  "images\products\soft-petal-1.jpg", "images\products\soft-petal-2.jpg",
  "images\products\midnight-ember-1.jpg", "images\products\midnight-ember-2.jpg",
  "images\products\crystal-bloom-1.jpg", "images\products\crystal-bloom-2.jpg",
  "images\products\iron-cedar-1.jpg", "images\products\iron-cedar-2.jpg",
  "images\products\pure-blanc-1.jpg", "images\products\pure-blanc-2.jpg",
  "images\products\golden-spire-1.jpg", "images\products\golden-spire-2.jpg",
  "images\categories\for-him.jpg", "images\categories\for-her.jpg", "images\categories\unisex.jpg",
  "images\instagram\01.jpg", "images\instagram\02.jpg", "images\instagram\03.jpg",
  "images\instagram\04.jpg", "images\instagram\05.jpg", "images\instagram\06.jpg",
  "images\about-bg.jpg"
)

foreach ($rel in $required) {
  $path = Join-Path $root $rel
  $dir = Split-Path $path -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  if (-not (Test-Path $path)) {
    Copy-Item $fallback $path
    Write-Host "Created missing: $rel"
  }
}

Write-Host "All image paths ready."

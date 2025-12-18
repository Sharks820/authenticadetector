$ErrorActionPreference = "Stop"
Write-Host "Installing Wrangler..."
npm install -g wrangler
$env:CLOUDFLARE_API_TOKEN = "DzPqgP0-Eua7Hc_aYIJes5jkQYiM-jp8UbFtDyeS"
Write-Host "Deploying to Cloudflare Pages..."
wrangler pages deploy . --project-name=authenticadetector
Write-Host "Done! Check https://authenticadetector.pages.dev"

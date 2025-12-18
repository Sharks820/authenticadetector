$ErrorActionPreference = "Stop"
$env:Path = "C:\Program Files\nodejs;" + $env:Path
$env:CLOUDFLARE_API_TOKEN = "DzPqgP0-Eua7Hc_aYIJes5jkQYiM-jp8UbFtDyeS"
Write-Host "Deploying enhanced AI detection to Cloudflare Pages..."
& "C:\Program Files\nodejs\npx.cmd" wrangler pages deploy . --project-name=authenticadetector --commit-dirty=true
Write-Host "Deployment complete!"

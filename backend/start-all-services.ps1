$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

$env:DOTENV_CONFIG_PATH = "./config/.env.development"

npx concurrently -n user,product,cart,wishlist -c blue,green,yellow,magenta `
  "npm run dev:user-service" `
  "npm run dev:product-service" `
  "npm run dev:cart-service" `
  "npm run dev:wishlist-service"

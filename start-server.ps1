Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Classic Cars - Serveur Local" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Demarrage du serveur HTTP..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Le site sera accessible a l'adresse:" -ForegroundColor Green
Write-Host "  http://localhost:8000" -ForegroundColor Green
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arreter le serveur" -ForegroundColor Yellow
Write-Host ""

Set-Location front
python -m http.server 8000

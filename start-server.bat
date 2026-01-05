@echo off
echo ========================================
echo   Classic Cars - Serveur Local
echo ========================================
echo.
echo Demarrage du serveur HTTP...
echo.
echo Le site sera accessible a l'adresse:
echo   http://localhost:8000
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.
cd front
python -m http.server 8000
pause

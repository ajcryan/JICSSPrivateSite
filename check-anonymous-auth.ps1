# Verify Anonymous Auth is Enabled

Write-Host "Checking if Anonymous Authentication is enabled..." -ForegroundColor Cyan
Write-Host ""

Write-Host "To verify and enable Anonymous Authentication:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to Firebase Console:" -ForegroundColor White
Write-Host "   https://console.firebase.google.com/project/jicssprivatesite/authentication/providers" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Look for 'Anonymous' in the list of sign-in providers" -ForegroundColor White
Write-Host ""
Write-Host "3. If it shows 'Disabled', click on it and:" -ForegroundColor White
Write-Host "   - Click the 'Enable' toggle" -ForegroundColor White
Write-Host "   - Click 'Save'" -ForegroundColor White
Write-Host ""
Write-Host "4. It should now show as 'Enabled'" -ForegroundColor Green
Write-Host ""
Write-Host "This is REQUIRED for the PDF viewer to work!" -ForegroundColor Red
Write-Host ""
Write-Host "After enabling, test again in production." -ForegroundColor Yellow

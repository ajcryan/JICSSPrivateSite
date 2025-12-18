# Grant Function Invoker Permission for Callable Functions
# For organizations that don't allow public function access

Write-Host "Setting up permissions for callable function in restrictive organization..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Your organization blocks public function access ('allUsers')." -ForegroundColor Yellow
Write-Host "For callable functions to work, you need to grant access to your project's service account." -ForegroundColor Yellow
Write-Host ""

Write-Host "=== Method 1: Using Google Cloud Console (Recommended) ===" -ForegroundColor Green
Write-Host ""
Write-Host "1. Go to Cloud Functions:" -ForegroundColor White
Write-Host "   https://console.cloud.google.com/functions/list?project=jicssprivatesite" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Click on 'getProtectedPdfUrl'" -ForegroundColor White
Write-Host ""
Write-Host "3. Click the 'PERMISSIONS' tab" -ForegroundColor White
Write-Host ""
Write-Host "4. Click 'ADD PRINCIPAL'" -ForegroundColor White
Write-Host ""
Write-Host "5. In 'New principals' field, TYPE this email:" -ForegroundColor White
Write-Host "   jicssprivatesite@appspot.gserviceaccount.com" -ForegroundColor Cyan
Write-Host "   (Just type it - don't look for it in a dropdown)" -ForegroundColor Yellow
Write-Host ""
Write-Host "6. In 'Select a role', search for and choose:" -ForegroundColor White
Write-Host "   Cloud Functions Invoker" -ForegroundColor Cyan
Write-Host ""
Write-Host "7. Click 'SAVE'" -ForegroundColor White
Write-Host ""
Write-Host "That's it! You only need to add the one service account above." -ForegroundColor Green
Write-Host ""

Write-Host "=== After Setting Permissions ===" -ForegroundColor Green
Write-Host "1. Wait 1-2 minutes for permissions to propagate" -ForegroundColor White
Write-Host "2. Clear browser cache completely" -ForegroundColor White
Write-Host "3. Test the PDF viewer in production" -ForegroundColor White
Write-Host ""

Write-Host "=== Alternative: Deploy as 2nd Gen Function ===" -ForegroundColor Yellow
Write-Host "2nd Gen functions have better permission handling." -ForegroundColor White
Write-Host "Let me know if you want to try this approach." -ForegroundColor White

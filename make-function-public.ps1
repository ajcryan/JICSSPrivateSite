# Make the Cloud Function publicly invokable
# This is safe because the function checks authentication internally via Bearer token

Write-Host "Making getProtectedPdfUrl function publicly accessible..." -ForegroundColor Cyan
Write-Host "Note: The function itself still requires authentication via Bearer token" -ForegroundColor Yellow
Write-Host ""

# Use Firebase CLI to deploy with public access
# For Cloud Functions Gen 1, we need to use gcloud or update via console

Write-Host "Please run the following command to make the function public:" -ForegroundColor Green
Write-Host ""
Write-Host "gcloud functions add-iam-policy-binding getProtectedPdfUrl \"  -ForegroundColor White
Write-Host "  --region=us-central1 \"  -ForegroundColor White
Write-Host "  --member=allUsers \"  -ForegroundColor White
Write-Host "  --role=roles/cloudfunctions.invoker" -ForegroundColor White
Write-Host ""
Write-Host "Or go to the Google Cloud Console:" -ForegroundColor Green
Write-Host "1. https://console.cloud.google.com/functions/list" -ForegroundColor Cyan
Write-Host "2. Click on 'getProtectedPdfUrl'" -ForegroundColor Cyan
Write-Host "3. Go to 'PERMISSIONS' tab" -ForegroundColor Cyan
Write-Host "4. Click 'ADD PRINCIPAL'" -ForegroundColor Cyan
Write-Host "5. Add 'allUsers' as principal" -ForegroundColor Cyan
Write-Host "6. Assign role 'Cloud Functions Invoker'" -ForegroundColor Cyan
Write-Host "7. Click 'SAVE'" -ForegroundColor Cyan
Write-Host ""
Write-Host "This is safe because:" -ForegroundColor Yellow
Write-Host "- The function itself validates Firebase Auth tokens" -ForegroundColor Yellow
Write-Host "- Only authenticated users with valid tokens can get PDF URLs" -ForegroundColor Yellow
Write-Host "- This just allows the HTTPS endpoint to be called" -ForegroundColor Yellow

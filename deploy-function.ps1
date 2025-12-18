# Deploy the Cloud Function to fix CORS issues
# This script deploys the updated function with proper CORS and auth handling

Write-Host "Deploying getProtectedPdfUrl function..." -ForegroundColor Cyan

# Deploy only the function (faster than deploying everything)
firebase deploy --only functions:getProtectedPdfUrl

Write-Host "`nFunction deployed successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Wait 1-2 minutes for the function to be fully available"
Write-Host "2. Clear your browser cache"
Write-Host "3. Test accessing a PDF in production"
Write-Host "4. Check browser console for detailed logs"

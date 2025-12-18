# Fixing CORS Error for Firebase Functions and Storage

## Problem
Getting "CORS missing Allow Origin" error when accessing PDFs in production. The error appears when calling the Cloud Function:
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at 
https://us-central1-jicssprivatesite.cloudfunctions.net/getProtectedPdfUrl. 
(Reason: CORS header 'Access-Control-Allow-Origin' missing). Status code: 403.
```

## Root Cause
The 403 error indicates that Firebase Authentication wasn't properly established before calling the Cloud Function. Callable functions (`functions.https.onCall`) handle CORS automatically, but only when the request succeeds. When authentication fails, CORS headers may not be set properly.

## Solution Overview
1. ✅ **Fixed**: Authentication flow to ensure Firebase Auth is fully initialized before calling the function
2. ✅ **Fixed**: Added better logging to debug authentication issues  
3. ✅ **Fixed**: Added delay to ensure auth state is established
4. **Deploy**: Deploy the updated function to production

## Steps to Fix

### Step 1: Deploy Updated Cloud Function (REQUIRED)

The code has been updated with:
- Better authentication logging
- Delay to ensure auth token is ready
- ID token verification before calling function
- Improved error handling

Deploy the updated function:

```powershell
# From your project directory
firebase deploy --only functions:getProtectedPdfUrl
```

Or use the provided script:
```powershell
.\deploy-function.ps1
```

**Important**: Wait 1-2 minutes after deployment for the function to be fully available.

### Step 2: Test in Production

1. Clear your browser cache (Ctrl+Shift+Delete)
2. Navigate to a whitepaper page in production
3. Open browser console (F12) to see detailed logs
4. Check for these log messages:
   - "Memberstack authenticated"
   - "Signed in to Firebase Auth" or "Already signed in to Firebase Auth"
   - "Got Firebase ID token"
   - "Calling Cloud Function"
   - "Cloud Function returned successfully"

If you see errors, the logs will show exactly where the problem is.

### Step 3: Configure Storage CORS (Only if needed after Step 1 & 2)

If the function works but you still get CORS errors when viewing the PDF itself (not when calling the function), configure CORS on the storage bucket:

#### 3a. Install Google Cloud SDK (if not already installed)
Download and install from: https://cloud.google.com/sdk/docs/install

#### 3b. Authenticate with Google Cloud
```powershell
gcloud auth login
```

#### 3c. Set your project
```powershell
gcloud config set project jicssprivatesite
```

#### 3d. Apply CORS configuration to your storage bucket
```powershell
gsutil cors set cors.json gs://jicssprivatesite.firebasestorage.app
```

#### 3e. Verify CORS configuration
```powershell
gsutil cors get gs://jicssprivatesite.firebasestorage.app
```

## What Was Fixed

### In functions/index.js
- Added detailed logging of auth context
- Better error messages for debugging

### In public/whitepapers/view-pdf.html
- Added Memberstack authentication logging
- Added Firebase Auth state logging
- Added 500ms delay after auth to ensure token is ready
- Added ID token verification before calling function
- Added detailed logging before function call
- Improved error handling with specific error codes

## What the CORS Configuration Does (cors.json)

The `cors.json` file:
- Allows requests from your Firebase hosting domains
- Allows GET and HEAD methods (for viewing/downloading PDFs)
- Sets appropriate response headers
- Caches CORS preflight requests for 1 hour

## Troubleshooting

### Still getting 403 errors?
Check the Firebase Functions logs:
```powershell
firebase functions:log --only getProtectedPdfUrl
```

Look for the log line that shows:
```
Function called. Auth context: { hasAuth: false, uid: undefined, isEmulator: false }
```

If `hasAuth` is `false`, the auth token isn't being passed. This could mean:
1. Function wasn't redeployed yet
2. Browser cache needs to be cleared
3. Firebase Auth sign-in is failing

### Getting "unauthenticated" errors?
This means Firebase Auth anonymous sign-in isn't working. Check:
1. Firebase Console > Authentication > Sign-in method
2. Make sure "Anonymous" is enabled
3. Check browser console for sign-in errors

### If You Have a Custom Domain

If you're using a custom domain (not just the default Firebase domains), add it to the `origin` array in `cors.json`:

```json
"origin": [
  "https://jicssprivatesite.web.app",
  "https://jicssprivatesite.firebaseapp.com",
  "https://your-custom-domain.com",
  "http://localhost:5000",
  "http://127.0.0.1:5000"
]
```

Then reapply the CORS configuration using Step 3d above.

## Testing Checklist

After deploying:
- [ ] Wait 2 minutes for function deployment
- [ ] Clear browser cache completely
- [ ] Test in production
- [ ] Open browser console to see logs
- [ ] Verify authentication logs appear
- [ ] Verify function is called successfully
- [ ] Verify PDF loads in iframe

## Notes

- Callable functions (`functions.https.onCall`) handle CORS automatically
- The 403 error was caused by authentication not being ready
- The fixes ensure auth is fully initialized before calling the function
- CORS configuration on storage bucket is usually not needed for signed URLs
- Changes may take a few minutes to propagate after deployment

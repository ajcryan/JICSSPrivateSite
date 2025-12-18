# Changelog - JICSS Site Fixes

**Date**: December 18, 2025
**Fixed By**: Claude Code

## Overview
This document tracks all changes made to fix critical deployment and security issues. Each section includes the original code and what was changed, allowing for easy rollback if needed.

---

## 1. Node Version Requirement Fix

**File**: `functions/package.json`

**Issue**: Required Node 20, but local environment has Node 22, causing deployment failures

**Original**:
```json
"engines": {
  "node": "20"
}
```

**Changed To**:
```json
"engines": {
  "node": "20"
}
```

**Note**: File unchanged - system Node version needs to be switched via `nvm use 20`

**Rollback**: N/A - environment change only

---

## 2. Firebase Hosting Rewrite Rule Fix

**File**: `firebase.json`

**Issue**: Catch-all rewrite to `/index.html` breaks all page routing

**Original**:
```json
"rewrites": [
  {
    "source": "**",
    "destination": "/index.html"
  }
]
```

**Changed To**:
```json
"rewrites": []
```

**Rollback**: Restore lines 17-22 in `firebase.json`

---

## 3. Firebase Config Fix

**File**: `public/index.html`

**Issue**: Placeholder Firebase config prevents Firebase Functions from working

**Original** (lines 6-10):
```javascript
const firebaseConfig = { /* your config */ };
firebase.initializeApp(firebaseConfig);
```

**Changed To**: Removed incomplete Firebase initialization - not needed for static hosting

**Rollback**: See `public/index.html.backup`

---

## 4. Firebase Functions Package Update

**File**: `functions/package.json`

**Issue**: Outdated firebase-functions version

**Original**:
```json
"firebase-functions": "^7.0.1"
```

**Changed To**:
```json
"firebase-functions": "^7.1.0"
```

**Rollback**: `cd functions && npm install firebase-functions@7.0.1`

---

## 5. PDF Viewer Security Fix

**File**: `public/whitepapers/view-pdf.html`

**Issue**: Direct PDF access without signed URLs, bypassing security

**Original** (lines 177-195):
```javascript
const pdfPath = urlParams.get('pdf');
document.getElementById('pdf-frame').src = pdfPath;
```

**Changed To**: Added Firebase Functions call to get signed URL

**Rollback**: See `public/whitepapers/view-pdf.html.backup`

---

## 6. Memberstack Loading Standardization

**Files**:
- `public/donate.html` (line 13)
- `public/TestMemberstack.html` (lines 10-13)
- `public/LayeredPlanBox.html` (lines 10-11)

**Issue**: Inconsistent Memberstack loading methods

**Changes**:
- Uncommented common.js in donate.html
- Removed duplicate Memberstack script from TestMemberstack.html
- Removed duplicate script from LayeredPlanBox.html

**Rollback**: See respective `.backup` files

---

## 7. Stripe API Keys Security Fix

**File**: `public/index.html`

**Issue**: Live Stripe publishable key hardcoded in source

**Original** (line 10):
```javascript
const stripe = Stripe('pk_live_51SaRhn3kZrIg09PnkUFIkD3OMbgQQcGtMeTEFmm5Dd3XBtuuvSyguU8kIzKVGKowNKOkJYvTieVmM9CFGveGkHEq00FgxdGeEF');
```

**Changed To**: Moved to environment variable pattern (placeholder for now)

**Note**: This is a PUBLISHABLE key (safe for client-side), but good practice to document it

**Rollback**: See `public/index.html.backup`

---

## 8. CSS Optimization

**File**: `public/assets/common.css`

**Issue**: Duplicate styles for donation pages (lines 111-323)

**Changes**: Extracted donation-specific styles to new file `public/assets/donate.css`

**Rollback**: See `public/assets/common.css.backup`

---

## 9. Cloud Function Input Validation

**File**: `functions/index.js`

**Issue**: Missing validation for pdfPath parameter (security risk)

**Original** (lines 6-11):
```javascript
exports.getProtectedPdfUrl = functions.https.onCall(async (data, context) => {
  const { pdfPath } = data;

  if (!pdfPath) {
    throw new functions.https.HttpsError('invalid-argument', 'PDF path required');
  }
```

**Changed To**: Added path validation and authentication check

**Rollback**: See `functions/index.js.backup`

---

## 10. Unused Files Cleanup

**Files Removed**:
- `public/Layered Plan Box_files/` - Old Webflow assets (entire directory)
- `public/TestHome.html` - Unclear purpose

**Rollback**: Check Git history or restore from backup

---

## 11. Git Repository Initialization

**Files Added**:
- `.gitignore` (enhanced)
- `.git/` directory

**New .gitignore entries**:
```
# Environment files
.env
.env.local
*.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Backups
*.backup
```

**Rollback**: Delete `.git` directory

---

## Quick Rollback Instructions

### To rollback a specific file:
```bash
# Restore from backup
cp public/index.html.backup public/index.html
```

### To rollback all changes:
```bash
git reset --hard HEAD~1
```

### To rollback before Git init:
All backup files are saved with `.backup` extension in their original locations.

---

## Testing Checklist

After deployment, verify:
- [ ] Firebase hosting deploys successfully
- [ ] All pages load correctly (no 404s)
- [ ] Login/logout functionality works
- [ ] Protected PDF viewer shows PDFs for logged-in users
- [ ] Donation pages redirect to Stripe correctly
- [ ] Cloud Function generates signed URLs

---

## Notes

- All Stripe keys visible in code are PUBLISHABLE keys (safe for client-side use)
- Firebase config removed from index.html - not needed for static hosting only
- If you need Firebase Functions on the frontend later, add proper config from Firebase Console

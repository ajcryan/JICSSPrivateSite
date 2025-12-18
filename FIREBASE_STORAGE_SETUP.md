# Firebase Storage Setup Guide

This guide explains how to use Firebase Storage for protected PDF files.

## How It Works

1. **PDF files** are stored in Firebase Storage (in production) or Storage Emulator (for local testing)
2. **Cloud Function** (`getProtectedPdfUrl`) generates signed URLs for authenticated users
3. **view-pdf.html** displays PDFs using these signed URLs

## Local Development with Emulator

### 1. Start Firebase Emulators

```bash
firebase emulators:start
```

This starts:
- Functions emulator on http://localhost:5001
- Hosting emulator on http://localhost:5000
- Storage emulator on http://localhost:9199
- Emulator UI on http://localhost:4000

### 2. Upload Test PDFs

**Option A: Using Emulator UI**
1. Go to http://localhost:4000
2. Click "Storage"
3. Click "Upload file"
4. Upload to path: `whitepapers/your-file.pdf`

**Option B: Using Upload Script**
1. Create a folder: `mkdir test-pdfs`
2. Add some PDF files to `test-pdfs/`
3. Edit `upload-test-pdfs.js` to list your files
4. Run: `node upload-test-pdfs.js`

### 3. Test the PDF Viewer

1. Open http://localhost:5000/whitepapers/view-pdf.html?pdf=whitepapers/your-file.pdf&title=Test%20Document
2. The page will automatically use the emulator (detects localhost)
3. You should see your PDF displayed

## Production Setup

### 1. Upload PDFs to Firebase Storage

```bash
# Using Firebase CLI
firebase storage:upload local-file.pdf gs://jicssprivatesite.firebasestorage.app/whitepapers/file.pdf

# Or use Firebase Console: https://console.firebase.google.com/project/jicssprivatesite/storage
```

### 2. Link to PDFs in Your Site

Use this URL format:
```
https://jicssprivatesite.web.app/whitepapers/view-pdf.html?pdf=whitepapers/file.pdf&title=Document%20Title
```

## Storage Structure

```
jicssprivatesite.firebasestorage.app/
└── whitepapers/
    ├── document1.pdf
    ├── document2.pdf
    └── subfolder/
        └── document3.pdf
```

## Security Rules

PDFs in the `whitepapers/` folder are protected:
- ✅ Read access: Authenticated users only
- ❌ Write access: Denied (upload via console/CLI only)

See `storage.rules` for details.

## Troubleshooting

### "PDF not found" error
- Check the file exists in Storage
- Verify the path matches exactly (case-sensitive)
- Ensure the file is in the `whitepapers/` folder

### "Authentication required" error
- User must be logged in via Memberstack
- Check Memberstack integration is working

### Emulator not working
- Ensure emulators are running: `firebase emulators:start`
- Check console for errors (F12 in browser)
- Verify ports 5000, 5001, 9199, 4000 are not in use

## File Upload Commands

### Upload single file:
```bash
firebase storage:upload ./local-file.pdf whitepapers/file.pdf
```

### Upload folder:
```bash
firebase storage:upload ./pdfs/ whitepapers/
```

### List files:
```bash
firebase storage:list whitepapers/
```

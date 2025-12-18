# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Firebase-hosted static website for the Japan Institute for Cyberspace Studies (JICSS) with member authentication via Memberstack and Firebase Cloud Functions for secure content delivery.

**Firebase Project**: `jicssprivatesite`

## Development Commands

### Firebase Hosting
- **Deploy hosting**: `firebase deploy --only hosting`
- **Test locally**: `firebase serve` or `firebase emulators:start`

### Firebase Cloud Functions (in `functions/` directory)
- **Deploy functions**: `firebase deploy --only functions`
- **Test functions locally**: `npm run serve` (from `functions/` directory)
- **View logs**: `npm run logs` (from `functions/` directory)
- **Functions shell**: `npm run shell` (from `functions/` directory)

### Full Deployment
- **Deploy everything**: `firebase deploy`

## Architecture

### Frontend Structure
- **Static hosting**: All public HTML/CSS/JS served from `public/` directory
- **Memberstack 2.0**: Authentication system integrated via `common.js`
  - App ID: `app_cmiqs1b7y008x0tq4e19d6vn8`
  - Loaded dynamically in all pages via header component
- **Shared components**: Header and footer injected via `public/assets/common.js`
  - Pages use `<div id="header-placeholder">` and `<div id="footer-placeholder">`
  - Components render on DOMContentLoaded

### Member-Protected Content
- **Whitepaper system**: `/whitepapers/` directory contains member-only content
- **PDF viewer**: `view-pdf.html` displays protected PDFs with authentication check
  - Redirects to login if user not authenticated
  - Accepts URL params: `?pdf=/path/to/file.pdf&title=Document%20Title`
- **Cache control**: `/whitepapers/**` paths have `no-cache` headers (see `firebase.json`)

### Firebase Cloud Functions
Located in `functions/index.js`:

- **`getProtectedPdfUrl`**: Callable function that generates signed URLs for Firebase Storage PDFs
  - Takes `pdfPath` parameter
  - Returns 1-hour signed URL for authenticated access
  - Used for secure PDF delivery to members

### Firebase Configuration
- **Clean URLs**: Enabled (`.html` extension optional)
- **URL rewrites**: All routes fall back to `/index.html` (SPA-style routing)
- **Redirects**: `.htm` URLs redirect to `.html` (301)
- **Node version**: 20 (for Cloud Functions)

### Key Dependencies
- **Frontend**: `@memberstack/dom` (v2.0.1)
- **Functions**: `firebase-admin`, `firebase-functions`

## File Organization

```
public/
├── assets/
│   ├── common.css     # Shared styles
│   ├── common.js      # Header/footer components + Memberstack loader
│   └── common1.js     # Additional shared scripts
├── whitepapers/
│   ├── index.html     # Protected whitepaper listing
│   └── view-pdf.html  # PDF viewer with auth check
└── [various .html pages]

functions/
├── index.js           # Cloud Functions entry point
└── package.json       # Functions dependencies
```

## Authentication Flow

1. User attempts to access protected content (e.g., `/whitepapers/`)
2. Memberstack checks authentication status via `window.$memberstackDom.getCurrentMember()`
3. If not authenticated, redirect to login page (`/TestMemberstack.html`)
4. Authenticated users can view content and request signed PDF URLs via Cloud Functions

## Important Notes

- **Memberstack integration**: Two versions used in codebase (v1 API via script tag, v2 via npm package)
- **PDF paths**: Reference Firebase Storage paths, not local file system paths
- **Signed URLs**: Generated server-side with 1-hour expiration for security
- **No build step**: Site is vanilla HTML/CSS/JS, no bundler or framework

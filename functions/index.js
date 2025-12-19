const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Callable function - works with org restrictions when properly configured
// Note: May require service account permissions instead of allUsers
exports.getProtectedPdfUrl = functions.https.onCall(async (data, context) => {
  const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';

  console.log('Function called:', {
    hasAuth: !!context.auth,
    uid: context.auth?.uid,
    isEmulator
  });

  // Require authentication in production
  if (!context.auth && !isEmulator) {
    console.error('No auth context');
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const { pdfPath } = data;

  // Validate
  if (!pdfPath || typeof pdfPath !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid PDF path');
  }

  if (pdfPath.includes('..') || pdfPath.startsWith('/') || !pdfPath.endsWith('.pdf')) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid PDF path format');
  }

  try {
    const bucket = admin.storage().bucket();
    const file = bucket.file(pdfPath);

    const [exists] = await file.exists();
    if (!exists) {
      throw new functions.https.HttpsError('not-found', 'PDF not found');
    }

    let url;
    if (isEmulator) {
      url = `http://127.0.0.1:9199/v0/b/${bucket.name}/o/${encodeURIComponent(pdfPath)}?alt=media`;
    } else {
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000
      });
      url = signedUrl;
    }

    const uid = context.auth ? context.auth.uid : 'emulator-user';
    console.log(`PDF accessed: ${pdfPath} by ${uid}`);

    return { url };
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to generate PDF URL');
  }
});

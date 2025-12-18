const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Callable function to get protected PDF URLs with Firebase Auth
exports.getProtectedPdfUrl = functions.https.onCall(async (data, context) => {
  // Check if we're running in emulator mode
  const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';

  // Check Firebase Authentication (production only)
  if (!context.auth && !isEmulator) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to access protected PDFs'
    );
  }

  // The actual payload might be in data.data depending on SDK version
  const payload = data.data || data;
  const { pdfPath } = payload;

  // Validate PDF path is provided
  if (!pdfPath) {
    throw new functions.https.HttpsError('invalid-argument', 'PDF path required');
  }

  // Validate path format and prevent directory traversal
  if (typeof pdfPath !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'PDF path must be a string');
  }

  // Prevent directory traversal attacks
  if (pdfPath.includes('..') || pdfPath.startsWith('/')) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid PDF path format'
    );
  }

  // Validate file extension
  if (!pdfPath.toLowerCase().endsWith('.pdf')) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Only PDF files are allowed'
    );
  }

  try {
    const bucket = admin.storage().bucket();
    const file = bucket.file(pdfPath);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      throw new functions.https.HttpsError('not-found', 'PDF not found');
    }

    let url;

    // In emulator mode, use direct emulator URL instead of signed URL
    if (isEmulator) {
      // Use the storage emulator URL
      const bucketName = bucket.name;
      url = `http://127.0.0.1:9199/v0/b/${bucketName}/o/${encodeURIComponent(pdfPath)}?alt=media`;
      console.log(`⚠️  Emulator mode: Using direct storage URL`);
    } else {
      // Generate signed URL (valid for 1 hour) for production
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000
      });
      url = signedUrl;
    }

    // Log access for security audit
    const userId = context.auth ? context.auth.uid : 'emulator-user';
    console.log(`PDF accessed: ${pdfPath} by user: ${userId}`);

    return { url };

  } catch (error) {
    console.error('Error generating PDF URL:', error);
    // Don't expose internal error details to client
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to generate PDF URL');
  }
});

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.getProtectedPdfUrl = functions.https.onCall(async (data, context) => {
  // Authentication check - require user to be logged in
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to access protected PDFs'
    );
  }

  const { pdfPath } = data;

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

    // Generate signed URL (valid for 1 hour)
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000
    });

    // Log access for security audit
    console.log(`PDF accessed: ${pdfPath} by user: ${context.auth.uid}`);

    return { url: signedUrl };

  } catch (error) {
    console.error('Error generating PDF URL:', error);
    // Don't expose internal error details to client
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to generate PDF URL');
  }
});

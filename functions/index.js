const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

admin.initializeApp();

// HTTPS function accessed through Firebase Hosting rewrite (no CORS issues, no public access needed)
exports.getProtectedPdfUrl = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';

      // Only allow POST
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      // Get auth token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        if (!isEmulator) {
          console.error('No authorization header');
          return res.status(401).json({ error: 'Unauthorized' });
        }
      }

      let uid = 'emulator-user';
      if (authHeader && !isEmulator) {
        const idToken = authHeader.split('Bearer ')[1];
        try {
          const decodedToken = await admin.auth().verifyIdToken(idToken);
          uid = decodedToken.uid;
          console.log('Authenticated user:', uid);
        } catch (error) {
          console.error('Token verification failed:', error);
          return res.status(401).json({ error: 'Invalid authentication token' });
        }
      }

      const { pdfPath } = req.body;

      const { pdfPath } = req.body;

      // Validate
      if (!pdfPath) {
        return res.status(400).json({ error: 'PDF path required' });
      }

      if (typeof pdfPath !== 'string' || pdfPath.includes('..') || pdfPath.startsWith('/')) {
        return res.status(400).json({ error: 'Invalid PDF path' });
      }

      if (!pdfPath.toLowerCase().endsWith('.pdf')) {
        return res.status(400).json({ error: 'Only PDF files allowed' });
      }

      const bucket = admin.storage().bucket();
      const file = bucket.file(pdfPath);

      const [exists] = await file.exists();
      if (!exists) {
        return res.status(404).json({ error: 'PDF not found' });
      }

      let url;
      if (isEmulator) {
        const bucketName = bucket.name;
        url = `http://127.0.0.1:9199/v0/b/${bucketName}/o/${encodeURIComponent(pdfPath)}?alt=media`;
      } else {
        const [signedUrl] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 60 * 60 * 1000
        });
        url = signedUrl;
      }

      console.log(`PDF accessed: ${pdfPath} by user: ${uid}`);
      return res.status(200).json({ url });

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Failed to generate PDF URL' });
    }
  });
});

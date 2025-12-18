const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin with emulator settings
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';

admin.initializeApp({
  projectId: 'jicssprivatesite',
  storageBucket: 'jicssprivatesite.firebasestorage.app'
});

async function testSignedUrls() {
  console.log('\n=== Testing Signed URL Generation ===\n');

  const bucket = admin.storage().bucket();

  // Upload a test PDF to the emulator
  const testPdfPath = '../public/whitepapers/documents/Japan Secure Technologies (JST) Business Plan (Condensed).pdf';
  const destinationPath = 'whitepapers/test-document.pdf';

  console.log('1. Uploading test PDF to Storage emulator...');
  try {
    await bucket.upload(testPdfPath, {
      destination: destinationPath,
      metadata: {
        contentType: 'application/pdf',
      }
    });
    console.log('   ✓ PDF uploaded successfully to:', destinationPath);
  } catch (error) {
    console.error('   ✗ Error uploading PDF:', error.message);
    return;
  }

  // Test signed URL generation
  console.log('\n2. Generating signed URL...');
  try {
    const file = bucket.file(destinationPath);

    // Check if file exists
    const [exists] = await file.exists();
    console.log('   File exists:', exists);

    if (!exists) {
      console.error('   ✗ File does not exist in storage');
      return;
    }

    // Generate signed URL (same method as the Cloud Function)
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000 // 1 hour
    });

    console.log('   ✓ Signed URL generated successfully!');
    console.log('   URL:', signedUrl.substring(0, 100) + '...');

    console.log('\n3. Testing URL accessibility...');
    console.log('   You can test this URL in your browser or with curl');
    console.log('   Note: When using emulators, the URL will point to localhost:9199');

  } catch (error) {
    console.error('   ✗ Error generating signed URL:', error.message);
    console.error('   Full error:', error);
  }

  console.log('\n=== Test Complete ===\n');

  // List all files in storage
  console.log('Files in Storage emulator:');
  try {
    const [files] = await bucket.getFiles();
    files.forEach(file => {
      console.log('  -', file.name);
    });
  } catch (error) {
    console.error('Error listing files:', error.message);
  }
}

testSignedUrls()
  .then(() => {
    console.log('\nYou can now test the function by visiting:');
    console.log('http://localhost:5000/whitepapers/view-pdf.html?pdf=whitepapers/test-document.pdf&title=Test%20Document');
    process.exit(0);
  })
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });

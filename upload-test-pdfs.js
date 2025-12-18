// Script to upload test PDFs to Firebase Storage Emulator
// Usage: node upload-test-pdfs.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin with emulator
process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'localhost:9199';

admin.initializeApp({
  projectId: 'jicssprivatesite',
  storageBucket: 'jicssprivatesite.firebasestorage.app'
});

const bucket = admin.storage().bucket();

// Function to upload a file
async function uploadFile(localFilePath, storageFilePath) {
  try {
    await bucket.upload(localFilePath, {
      destination: storageFilePath,
      metadata: {
        contentType: 'application/pdf'
      }
    });
    console.log(`✅ Uploaded: ${storageFilePath}`);
  } catch (error) {
    console.error(`❌ Error uploading ${storageFilePath}:`, error.message);
  }
}

// Main function
async function uploadTestPDFs() {
  console.log('Uploading test PDFs to Firebase Storage Emulator...\n');

  // Example: Upload PDF files from a local directory
  // Replace these with your actual PDF file paths
  const testFiles = [
    { local: './test-pdfs/sample1.pdf', storage: 'whitepapers/sample1.pdf' },
    { local: './test-pdfs/sample2.pdf', storage: 'whitepapers/sample2.pdf' }
  ];

  for (const file of testFiles) {
    if (fs.existsSync(file.local)) {
      await uploadFile(file.local, file.storage);
    } else {
      console.log(`⚠️  File not found: ${file.local}`);
    }
  }

  console.log('\n✅ Upload complete!');
  console.log('View files at: http://localhost:4000/storage');
  process.exit(0);
}

uploadTestPDFs();

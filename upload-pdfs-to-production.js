const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin for PRODUCTION
admin.initializeApp({
  projectId: 'jicssprivatesite',
  storageBucket: 'jicssprivatesite.firebasestorage.app'
});

async function uploadPdfs() {
  console.log('\n=== Uploading PDFs to Production Storage ===\n');

  const bucket = admin.storage().bucket();
  const pdfDir = path.join(__dirname, 'public/whitepapers/documents');

  try {
    // Get all PDF files
    const files = fs.readdirSync(pdfDir).filter(file => file.endsWith('.pdf'));

    console.log(`Found ${files.length} PDF files to upload\n`);

    for (const file of files) {
      const localPath = path.join(pdfDir, file);
      const destinationPath = `whitepapers/${file}`;

      console.log(`Uploading: ${file}`);
      console.log(`  From: ${localPath}`);
      console.log(`  To: ${destinationPath}`);

      await bucket.upload(localPath, {
        destination: destinationPath,
        metadata: {
          contentType: 'application/pdf',
          cacheControl: 'private, no-cache, no-store, must-revalidate'
        }
      });

      console.log(`  ✓ Uploaded successfully\n`);
    }

    console.log('=== All PDFs uploaded successfully! ===\n');
    console.log('You can now access these PDFs via the view-pdf.html page');

  } catch (error) {
    console.error('Error uploading PDFs:', error);
    process.exit(1);
  }

  process.exit(0);
}

uploadPdfs();

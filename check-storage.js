const admin = require('firebase-admin');

admin.initializeApp({
  projectId: 'jicssprivatesite',
  storageBucket: 'jicssprivatesite.firebasestorage.app'
});

async function listFiles() {
  const bucket = admin.storage().bucket();
  const [files] = await bucket.getFiles({ prefix: 'whitepapers/' });
  
  console.log('\n=== Files in Production Storage (whitepapers/) ===\n');
  if (files.length === 0) {
    console.log('❌ No files found in whitepapers/ folder');
    console.log('\nYou need to upload PDFs to Firebase Storage first.');
    console.log('Go to: https://console.firebase.google.com/project/jicssprivatesite/storage');
  } else {
    console.log(`Found ${files.length} files:\n`);
    files.forEach(file => {
      console.log(`  ✓ ${file.name}`);
    });
  }
  console.log('\n');
  process.exit(0);
}

listFiles().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

const fs = require('fs');
const https = require('https');

// Get credentials  
const token = fs.readFileSync('../credentials/vimeo-access-token.txt', 'utf8').replace(/\s/g, '');

const videoPath = process.argv[2];
const title = process.argv[3] || 'Untitled Video';
const description = process.argv[4] || '';

if (!videoPath) {
  console.error('Usage: node upload-to-vimeo.js <video-file> [title] [description]');
  process.exit(1);
}

const videoStats = fs.statSync(videoPath);
const videoSize = videoStats.size;

console.log(`📤 Uploading: ${videoPath}`);
console.log(`📦 Size: ${(videoSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`🎬 Title: ${title}`);

// Step 1: Create upload ticket
const createUpload = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      upload: {
        approach: 'tus',
        size: videoSize
      },
      name: title,
      description: description,
      privacy: {
        view: 'anybody',
        embed: 'public'
      }
    });

    const options = {
      hostname: 'api.vimeo.com',
      path: '/me/videos',
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.vimeo.*+json;version=3.4'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          resolve(response);
        } else {
          reject(`Upload creation failed: ${res.statusCode} - ${data}`);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
};

// Step 2: Upload via tus
const uploadFile = async (uploadLink) => {
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);

  console.log('📡 Uploading video file...');
  
  try {
    // Use curl for tus upload
    const cmd = `curl -X PATCH "${uploadLink}" ` +
      `-H "Tus-Resumable: 1.0.0" ` +
      `-H "Upload-Offset: 0" ` +
      `-H "Content-Type: application/offset+octet-stream" ` +
      `-H "Authorization: bearer ${token}" ` +
      `--data-binary "@${videoPath}"`;
    
    await execAsync(cmd, { maxBuffer: 1024 * 1024 * 500 });
    console.log('✅ Upload complete!');
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Main execution
(async () => {
  try {
    console.log('\n🎥 Creating upload ticket...');
    const response = await createUpload();
    
    const videoUri = response.uri;
    const uploadLink = response.upload.upload_link;
    const videoUrl = `https://vimeo.com${videoUri.replace('/videos/', '/')}`;
    
    console.log(`✅ Video created: ${videoUrl}`);
    
    await uploadFile(uploadLink);
    
    console.log('\n🎉 SUCCESS!');
    console.log(`🔗 Vimeo URL: ${videoUrl}`);
    console.log(`📋 Video ID: ${videoUri.split('/').pop()}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();

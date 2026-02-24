#!/usr/bin/env node

/**
 * Newsletter Hour Automation
 * 
 * Automates the weekly Newsletter Hour workflow:
 * 1. Find latest Vimeo recording
 * 2. Download transcript
 * 3. Generate recap
 * 4. Create Course Sprout lesson
 * 5. Notify Chad
 * 
 * Run: node scripts/newsletter-hour-automation.js [--date YYYY-MM-DD] [--status]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  vimeo: {
    userId: '41953625',
    tokenPath: path.join(__dirname, '../credentials/vimeo-access-token.txt'),
    folder: 'Zoom Recordings',
    searchPattern: 'Local Newsletter Hour'
  },
  coursesprout: {
    courseId: 340, // OpenClaw Shadow Intensive
    chapterId: 958, // Replays
    apiKeyPath: path.join(__dirname, '../credentials/titanium-api-keys.txt')
  },
  paths: {
    transcripts: path.join(__dirname, '../transcripts/vimeo'),
    recaps: path.join(__dirname, '../recaps'),
    logs: path.join(__dirname, '../logs')
  }
};

// Ensure directories exist
Object.values(CONFIG.paths).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Get Vimeo access token
 */
function getVimeoToken() {
  try {
    return fs.readFileSync(CONFIG.vimeo.tokenPath, 'utf8').trim();
  } catch (error) {
    throw new Error(`Failed to read Vimeo token: ${error.message}`);
  }
}

/**
 * Get Course Sprout API key
 */
function getCoursesproutKey() {
  try {
    const content = fs.readFileSync(CONFIG.coursesprout.apiKeyPath, 'utf8');
    const match = content.match(/CourseSprout:\s*(.+)/);
    if (!match) throw new Error('CourseSprout key not found in credentials file');
    return match[1].trim();
  } catch (error) {
    throw new Error(`Failed to read Course Sprout key: ${error.message}`);
  }
}

/**
 * Search Vimeo for latest Newsletter Hour recording
 */
async function findLatestVideo(targetDate) {
  const token = getVimeoToken();
  const dateStr = targetDate || new Date().toISOString().split('T')[0];
  
  log(`Searching Vimeo for Newsletter Hour recording on ${dateStr}...`);
  
  const searchUrl = `https://api.vimeo.com/users/${CONFIG.vimeo.userId}/videos?query=${encodeURIComponent(CONFIG.vimeo.searchPattern)}&per_page=10&sort=date`;
  
  const response = await fetch(searchUrl, {
    headers: {
      'Authorization': `bearer ${token}`,
      'Accept': 'application/vnd.vimeo.*+json;version=3.4'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Vimeo API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Find video matching the date
  for (const video of data.data) {
    if (video.name.includes(dateStr)) {
      log(`✓ Found video: ${video.name} (${video.uri})`);
      return {
        id: video.uri.split('/').pop(),
        name: video.name,
        url: video.link,
        privacy: video.privacy.view,
        created: video.created_time
      };
    }
  }
  
  throw new Error(`No Newsletter Hour video found for ${dateStr}`);
}

/**
 * Check if video is public
 */
function checkVideoPrivacy(video) {
  if (video.privacy !== 'anybody') {
    log(`⚠️  Video is private (${video.privacy}) - needs to be set to public`);
    return false;
  }
  log(`✓ Video is public`);
  return true;
}

/**
 * Download transcript using vimeo-transcript skill
 */
async function downloadTranscript(videoUrl, dateStr) {
  log(`Downloading transcript for ${videoUrl}...`);
  
  const skillPath = path.join(__dirname, '../skills/vimeo-transcript');
  const outputPath = path.join(CONFIG.paths.transcripts, `newsletter-hour-${dateStr}.txt`);
  
  try {
    // Run the vimeo-transcript skill
    const result = execSync(
      `cd "${skillPath}" && node main.js "${videoUrl}"`,
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
    );
    
    log(`✓ Transcript downloaded`);
    
    // Find the transcript file (skill saves it automatically)
    const files = fs.readdirSync(CONFIG.paths.transcripts);
    const latest = files
      .filter(f => f.startsWith('newsletter-hour') && f.endsWith('.txt'))
      .sort()
      .pop();
    
    if (latest) {
      const sourcePath = path.join(CONFIG.paths.transcripts, latest);
      if (sourcePath !== outputPath) {
        fs.copyFileSync(sourcePath, outputPath);
      }
      return outputPath;
    }
    
    throw new Error('Transcript file not found after download');
  } catch (error) {
    throw new Error(`Failed to download transcript: ${error.message}`);
  }
}

/**
 * Generate recap using AI
 */
async function generateRecap(transcriptPath, videoInfo, dateStr) {
  log(`Generating recap from transcript...`);
  
  const transcript = fs.readFileSync(transcriptPath, 'utf8');
  
  // Call the recap generator script
  const recapScript = path.join(__dirname, 'generate-newsletter-recap.js');
  const result = execSync(
    `node "${recapScript}" "${transcriptPath}" "${videoInfo.url}" "${dateStr}"`,
    { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
  );
  
  const recapPath = path.join(CONFIG.paths.recaps, `newsletter-hour-${dateStr}.md`);
  
  if (fs.existsSync(recapPath)) {
    log(`✓ Recap generated: ${recapPath}`);
    return recapPath;
  }
  
  throw new Error('Recap file not found after generation');
}

/**
 * Create Course Sprout lesson
 */
async function createCoursesproutLesson(recapPath, videoInfo, dateStr) {
  log(`Creating Course Sprout lesson...`);
  
  const apiKey = getCoursesproutKey();
  const recap = fs.readFileSync(recapPath, 'utf8');
  
  // Extract sections from recap
  const sections = parseRecap(recap);
  
  const lessonData = {
    title: `Newsletter Hour ${dateStr}`,
    videoUrl: videoInfo.url,
    videoType: 'vimeo',
    shortDescription: sections.summary || 'Weekly Newsletter Hour call recap and key insights',
    longDescription: recap,
    goalBlock: {
      points: 10,
      commentsRequired: 1,
      userInputRequired: 1,
      text: sections.actionItems || 'Review this week\'s key topics and share your biggest takeaway in the comments!'
    }
  };
  
  const response = await fetch(
    `https://api.coursesprout.com/api/ai/courses/${CONFIG.coursesprout.courseId}/chapters/${CONFIG.coursesprout.chapterId}/lessons`,
    {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lessonData)
    }
  );
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Course Sprout API error: ${response.status} - ${error}`);
  }
  
  const lesson = await response.json();
  log(`✓ Lesson created: ${lesson.data?.id || 'success'}`);
  
  return lesson;
}

/**
 * Parse recap sections
 */
function parseRecap(recapText) {
  const sections = {};
  
  // Extract summary (first paragraph)
  const summaryMatch = recapText.match(/^(.+?)(?:\n\n|$)/s);
  if (summaryMatch) {
    sections.summary = summaryMatch[1].trim();
  }
  
  // Extract action items
  const actionMatch = recapText.match(/##\s*Action Items(.+?)(?=##|$)/s);
  if (actionMatch) {
    sections.actionItems = actionMatch[1].trim();
  }
  
  return sections;
}

/**
 * Log to console and file
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  console.log(logMessage);
  
  const logFile = path.join(CONFIG.paths.logs, 'newsletter-hour-automation.log');
  fs.appendFileSync(logFile, logMessage + '\n');
}

/**
 * Send notification to Chad
 */
function notifyChad(message) {
  log(`📬 Notification: ${message}`);
  // TODO: Implement actual notification (Telegram, email, etc.)
  // For now, just log it
}

/**
 * Main automation function
 */
async function runAutomation(targetDate) {
  const dateStr = targetDate || new Date().toISOString().split('T')[0];
  
  log(`\n🚀 Starting Newsletter Hour automation for ${dateStr}...\n`);
  
  try {
    // Step 1: Find video
    const video = await findLatestVideo(dateStr);
    
    // Step 2: Check privacy
    if (!checkVideoPrivacy(video)) {
      notifyChad(`Newsletter Hour video (${dateStr}) is private. Please make it public to continue automation.`);
      return { success: false, reason: 'video_private' };
    }
    
    // Step 3: Download transcript
    const transcriptPath = await downloadTranscript(video.url, dateStr);
    
    // Step 4: Generate recap
    const recapPath = await generateRecap(transcriptPath, video, dateStr);
    
    // Step 5: Create Course Sprout lesson
    const lesson = await createCoursesproutLesson(recapPath, video, dateStr);
    
    // Step 6: Notify Chad
    notifyChad(`Newsletter Hour automation complete! Recap created and Course Sprout lesson is ready for review.`);
    
    log(`\n✅ Automation complete!\n`);
    log(`   Transcript: ${transcriptPath}`);
    log(`   Recap: ${recapPath}`);
    log(`   Lesson: Course ${CONFIG.coursesprout.courseId}, Chapter ${CONFIG.coursesprout.chapterId}\n`);
    
    return { success: true, transcriptPath, recapPath, lesson };
    
  } catch (error) {
    log(`\n❌ Automation failed: ${error.message}\n`);
    notifyChad(`Newsletter Hour automation failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * CLI handler
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--status')) {
    // Show last run status
    const logFile = path.join(CONFIG.paths.logs, 'newsletter-hour-automation.log');
    if (fs.existsSync(logFile)) {
      const logs = fs.readFileSync(logFile, 'utf8').split('\n');
      console.log('Last 20 log entries:');
      console.log(logs.slice(-20).join('\n'));
    } else {
      console.log('No automation runs yet.');
    }
    return;
  }
  
  const dateArg = args.find(arg => arg.startsWith('--date'));
  const targetDate = dateArg ? dateArg.split('=')[1] : null;
  
  await runAutomation(targetDate);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { runAutomation };

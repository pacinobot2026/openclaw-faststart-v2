#!/usr/bin/env node

/**
 * Generate Newsletter Hour Recap
 * 
 * Analyzes transcript and generates formatted recap markdown
 * 
 * Usage: node generate-newsletter-recap.js <transcript-path> <video-url> <date>
 */

const fs = require('fs');
const path = require('path');

/**
 * Analyze transcript and extract key information
 */
function analyzeTranscript(transcript) {
  const lines = transcript.split('\n').filter(line => line.trim());
  
  // Simple extraction (in production, use LLM API for better analysis)
  const analysis = {
    topics: extractTopics(lines),
    names: extractNames(lines),
    actionItems: extractActionItems(lines),
    quotes: extractQuotes(lines),
    wordCount: transcript.split(/\s+/).length
  };
  
  return analysis;
}

/**
 * Extract key topics from transcript
 */
function extractTopics(lines) {
  const topics = [];
  const topicKeywords = [
    'today we', 'talking about', 'going to cover', 'important', 
    'announcement', 'new feature', 'update', 'strategy'
  ];
  
  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    topicKeywords.forEach(keyword => {
      if (lowerLine.includes(keyword)) {
        topics.push(line.trim().substring(0, 100));
      }
    });
  });
  
  return topics.slice(0, 5); // Top 5 topics
}

/**
 * Extract names mentioned
 */
function extractNames(lines) {
  const names = new Set();
  const namePatterns = [
    /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g, // First Last
    /\b(shoutout to|thanks to|kudos to)\s+([A-Z][a-z]+)/gi
  ];
  
  lines.forEach(line => {
    namePatterns.forEach(pattern => {
      const matches = line.matchAll(pattern);
      for (const match of matches) {
        const name = match[match.length - 1] || match[1];
        if (name && name.length > 2) {
          names.add(name.trim());
        }
      }
    });
  });
  
  return Array.from(names).slice(0, 10);
}

/**
 * Extract action items
 */
function extractActionItems(lines) {
  const actions = [];
  const actionKeywords = [
    'you should', 'make sure', 'don\'t forget', 'remember to',
    'action item', 'homework', 'next step', 'go ahead and'
  ];
  
  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    actionKeywords.forEach(keyword => {
      if (lowerLine.includes(keyword)) {
        actions.push(line.trim().substring(0, 150));
      }
    });
  });
  
  return actions.slice(0, 5);
}

/**
 * Extract quotable quotes
 */
function extractQuotes(lines) {
  const quotes = [];
  
  // Look for impactful statements
  lines.forEach(line => {
    if (line.length > 50 && line.length < 200) {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('the key is') || 
          lowerLine.includes('remember') ||
          lowerLine.includes('important') ||
          line.match(/[!.]{2,}/)) {
        quotes.push(line.trim());
      }
    }
  });
  
  return quotes.slice(0, 3);
}

/**
 * Generate recap markdown
 */
function generateRecap(analysis, videoUrl, dateStr) {
  const recap = `# Newsletter Hour - ${dateStr}

**Video:** ${videoUrl}
**Date:** ${new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
**Duration:** ~2 hours

---

## 🎙️ The Big News

${analysis.topics.length > 0 ? analysis.topics.slice(0, 2).map(t => `- ${t}`).join('\n') : '- Check the video for key announcements'}

---

## 📌 Key Topics Covered

${analysis.topics.length > 0 ? analysis.topics.map((topic, i) => `${i + 1}. ${topic}`).join('\n') : '1. See video for full coverage'}

---

## ⭐ Highlights

${analysis.quotes.length > 0 ? analysis.quotes.map(q => `> "${q}"`).join('\n\n') : '> Check the video for memorable moments'}

---

## 👥 Shoutouts

${analysis.names.length > 0 ? analysis.names.map(name => `- ${name}`).join('\n') : '- Community members mentioned in the call'}

---

## ✅ Action Items

${analysis.actionItems.length > 0 ? analysis.actionItems.map(action => `- [ ] ${action}`).join('\n') : '- [ ] Review the call and implement key strategies discussed'}

---

## 💬 Quotable Quote

${analysis.quotes.length > 0 ? `> "${analysis.quotes[0]}"` : '> "The power is in taking action and implementing what you learn."'}

---

**Transcript Word Count:** ${analysis.wordCount.toLocaleString()} words
**Generated:** ${new Date().toISOString()}
`;
  
  return recap;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('Usage: node generate-newsletter-recap.js <transcript-path> <video-url> <date>');
    process.exit(1);
  }
  
  const [transcriptPath, videoUrl, dateStr] = args;
  
  // Read transcript
  const transcript = fs.readFileSync(transcriptPath, 'utf8');
  
  // Analyze
  const analysis = analyzeTranscript(transcript);
  
  // Generate recap
  const recap = generateRecap(analysis, videoUrl, dateStr);
  
  // Save recap
  const recapPath = path.join(
    path.dirname(path.dirname(transcriptPath)), // Go up to workspace
    'recaps',
    `newsletter-hour-${dateStr}.md`
  );
  
  fs.writeFileSync(recapPath, recap);
  
  console.log(`✓ Recap generated: ${recapPath}`);
  console.log(`\n${recap}\n`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { analyzeTranscript, generateRecap };

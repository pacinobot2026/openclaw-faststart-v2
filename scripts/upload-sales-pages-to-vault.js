const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const https = require('https');
const FormData = require('form-data');

const SUPABASE_URL = 'https://jqqvqdjxviqnsgpxcgfs.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcXZxZGp4dmlxbnNncHhjZ2ZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2MjIwOSwiZXhwIjoyMDg3NTM4MjA5fQ.ibJyHrxx2TlfRbfh-9IKD3-kY9aSXAfrDJ1ZHVFijOQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const salesPages = [
  { file: '01-key-elements-diagram.jpg', title: 'Key Elements Diagram', notes: 'Blueprint showing 7 essential elements of a sales page' },
  { file: '02-easywebinar-amy-porterfield.jpg', title: 'EasyWebinar (Amy Porterfield)', notes: 'Clean white background, green CTA, pricing toggle, dark section with benefit cards' },
  { file: '03-copyhackers-seasonal-sales.jpg', title: 'Copyhackers - Master of Seasonal Sales', notes: 'Bold headline, yellow accent, hero video with play button' },
  { file: '04-digitalmarketer-ecommerce-cert.jpg', title: 'DigitalMarketer E-Commerce Cert', notes: 'Badge prominent, green CTA, countdown timer, social proof logos' },
  { file: '05-digitalmarketer-linkedin-workshop.jpg', title: 'DigitalMarketer LinkedIn Workshop', notes: 'Specific benefit headline, video + CTA box layout, large number callout' },
  { file: '06-rainmaker-ai-course.jpg', title: 'RainMaker AI Course Creation', notes: 'Black background, white headline, large video thumbnail, red countdown timer' },
  { file: '07-golden-era-physique.jpg', title: 'Golden Era Physique System', notes: 'Gold color scheme, bold claim, checkmark bullets, two-column layout' },
  { file: '08-jordan-peterson-personality.jpg', title: 'Dr. Jordan Peterson Course', notes: 'Dark dramatic background, author credibility, social proof, 4-column benefit grid' },
  { file: '09-keap-academy-workshop.jpg', title: 'Keap Academy Workshop', notes: 'Bright blue hero, event label, countdown timer, clean modern design' },
  { file: '10-full-focus-burnout.jpg', title: 'Full Focus - Burnout to Balance', notes: 'Serif headline, before/after frame, tan CTA, lifestyle imagery' },
  { file: '11-mindvalley-unlimited-abundance.jpg', title: 'Mindvalley Unlimited Abundance', notes: 'Clean white background, purple CTA, time commitment shown, minimalist' },
  { file: '12-launch-system-battle-tested.jpg', title: 'Launch System Battle Tested', notes: 'Long headline with social proof, media logos, product mockup, orange CTA' },
  { file: '13-selena-soo-publicity.jpg', title: 'Selena Soo Publicity Services', notes: 'Hero joy image, yellow accent, media badges, checkmark bullets' },
  { file: '14-smile-direct-club.jpg', title: 'Smile Direct Club', notes: 'Purple header, clear value prop, Trustpilot badge, monthly offers grid' },
  { file: '15-4week-shred.jpg', title: '4 Week Shred Program', notes: 'Dark background, high-contrast blue, dramatic copy, results-focused' },
  { file: '16-tiny-offer.jpg', title: 'Tiny Offer Digital Product', notes: 'Dark gray background, yellow CTA, three-column benefits, video thumbnail' },
  { file: '17-ran-segall-web-design.jpg', title: 'Ran Segall Web Design Course', notes: 'Bold purple headline, large centered video, student count with avatars' },
  { file: '18-yogalates-london.jpg', title: 'Yogalates London Classes', notes: 'Teal header, serif font, minimalist design, lifestyle wellness imagery' }
];

async function uploadToImgur(filePath) {
  const imageData = fs.readFileSync(filePath).toString('base64');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.imgur.com',
      path: '/3/upload',
      method: 'POST',
      headers: {
        'Authorization': 'Client-ID 546c25a59c58ad7',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.data && result.data.link) {
            resolve(result.data.link);
          } else {
            reject(new Error('Failed to upload: ' + data));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify({ image: imageData }));
    req.end();
  });
}

async function main() {
  console.log('🎬 Uploading 18 sales pages to Operator Vault...\n');

  const basePath = path.join(__dirname, '..', 'references', 'sales-pages');
  const itemsToInsert = [];

  for (const page of salesPages) {
    const filePath = path.join(basePath, page.file);
    
    console.log(`📤 Uploading ${page.file}...`);
    
    try {
      const url = await uploadToImgur(filePath);
      console.log(`✅ Uploaded: ${url}`);
      
      itemsToInsert.push({
        title: page.title,
        category: 'Sales Pages',
        type: 'Screenshot',
        resource_url: url,
        notes: page.notes,
        tags: ['high-converting', 'example', 'reference']
      });
      
      // Rate limit: wait 1 second between uploads
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to upload ${page.file}:`, error.message);
    }
  }

  console.log(`\n📥 Inserting ${itemsToInsert.length} items into vault...`);

  const { data, error } = await supabase
    .from('vault_items')
    .insert(itemsToInsert)
    .select();

  if (error) {
    console.error('❌ Database error:', error);
    return;
  }

  console.log(`✅ SUCCESS! Added ${data.length} sales pages to Operator Vault`);
  console.log('\n🔗 View at: https://vizard-clips-app.vercel.app/vault');
}

main().catch(console.error);

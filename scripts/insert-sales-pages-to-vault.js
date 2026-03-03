const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jqqvqdjxviqnsgpxcgfs.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcXZxZGp4dmlxbnNncHhjZ2ZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2MjIwOSwiZXhwIjoyMDg3NTM4MjA5fQ.ibJyHrxx2TlfRbfh-9IKD3-kY9aSXAfrDJ1ZHVFijOQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const salesPages = [
  { url: 'https://i.imgur.com/wWvbxmh.jpeg', title: 'Key Elements Diagram', notes: 'Blueprint showing 7 essential elements of a sales page' },
  { url: 'https://i.imgur.com/7QSUfiR.jpeg', title: 'EasyWebinar (Amy Porterfield)', notes: 'Clean white background, green CTA, pricing toggle, dark section with benefit cards' },
  { url: 'https://i.imgur.com/N276hbr.jpeg', title: 'Copyhackers - Master of Seasonal Sales', notes: 'Bold headline, yellow accent, hero video with play button' },
  { url: 'https://i.imgur.com/GsNSW0V.jpeg', title: 'DigitalMarketer E-Commerce Cert', notes: 'Badge prominent, green CTA, countdown timer, social proof logos' },
  { url: 'https://i.imgur.com/3dZgs4w.jpeg', title: 'DigitalMarketer LinkedIn Workshop', notes: 'Specific benefit headline, video + CTA box layout, large number callout' },
  { url: 'https://i.imgur.com/z1qld8o.jpeg', title: 'RainMaker AI Course Creation', notes: 'Black background, white headline, large video thumbnail, red countdown timer' },
  { url: 'https://i.imgur.com/qLw1hGr.jpeg', title: 'Golden Era Physique System', notes: 'Gold color scheme, bold claim, checkmark bullets, two-column layout' },
  { url: 'https://i.imgur.com/ANhQWcO.jpeg', title: 'Dr. Jordan Peterson Course', notes: 'Dark dramatic background, author credibility, social proof, 4-column benefit grid' },
  { url: 'https://i.imgur.com/GyGJf1t.jpeg', title: 'Keap Academy Workshop', notes: 'Bright blue hero, event label, countdown timer, clean modern design' },
  { url: 'https://i.imgur.com/64ndaw5.jpeg', title: 'Full Focus - Burnout to Balance', notes: 'Serif headline, before/after frame, tan CTA, lifestyle imagery' },
  { url: 'https://i.imgur.com/2x1gbyx.jpeg', title: 'Mindvalley Unlimited Abundance', notes: 'Clean white background, purple CTA, time commitment shown, minimalist' },
  { url: 'https://i.imgur.com/bbszdjy.jpeg', title: 'Launch System Battle Tested', notes: 'Long headline with social proof, media logos, product mockup, orange CTA' },
  { url: 'https://i.imgur.com/CdcPWN8.jpeg', title: 'Selena Soo Publicity Services', notes: 'Hero joy image, yellow accent, media badges, checkmark bullets' },
  { url: 'https://i.imgur.com/V1OcvPg.jpeg', title: 'Smile Direct Club', notes: 'Purple header, clear value prop, Trustpilot badge, monthly offers grid' },
  { url: 'https://i.imgur.com/nr5nPz2.jpeg', title: '4 Week Shred Program', notes: 'Dark background, high-contrast blue, dramatic copy, results-focused' },
  { url: 'https://i.imgur.com/qvXM3z4.jpeg', title: 'Tiny Offer Digital Product', notes: 'Dark gray background, yellow CTA, three-column benefits, video thumbnail' },
  { url: 'https://i.imgur.com/mEvyh1g.jpeg', title: 'Ran Segall Web Design Course', notes: 'Bold purple headline, large centered video, student count with avatars' },
  { url: 'https://i.imgur.com/oAjcTls.jpeg', title: 'Yogalates London Classes', notes: 'Teal header, serif font, minimalist design, lifestyle wellness imagery' }
];

async function main() {
  console.log('📥 Inserting 18 sales pages into Operator Vault...\n');

  const itemsToInsert = salesPages.map(page => ({
    title: page.title,
    category: 'Sales Pages',
    type: 'Screenshot',
    resource_url: page.url,
    notes: page.notes,
    tags: ['high-converting', 'example', 'reference']
  }));

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
  console.log('🔑 Password: VizardClips2026!');
}

main().catch(console.error);

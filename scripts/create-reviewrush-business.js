const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jqqvqdjxviqnsgpxcgfs.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcXZxZGp4dmlxbnNncHhjZ2ZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2MjIwOSwiZXhwIjoyMDg3NTM4MjA5fQ.ibJyHrxx2TlfRbfh-9IKD3-kY9aSXAfrDJ1ZHVFijOQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const marketingTasks = [
  { title: 'VSL Script', column: 'Marketing', description: 'Write conversion-focused VSL script' },
  { title: 'VSL Audio', column: 'Marketing', description: 'Generate audio with ElevenLabs (Chad voice)' },
  { title: 'VSL Video', column: 'Marketing', description: 'Build slides + render video' },
  { title: 'Sales Page Copy', column: 'Marketing', description: 'Long-form sales page with all 10 directive elements' },
  { title: 'Sales Page Build', column: 'Marketing', description: 'Next.js sales page + Stripe checkout' },
  { title: 'Ad Hooks (5)', column: 'Marketing', description: '5 Facebook ad hooks for testing' },
  { title: 'Launch Posts', column: 'Marketing', description: 'Social media launch content' }
];

const followupTasks = [
  { title: 'Email 1: Welcome', column: 'Follow-up', description: 'Immediate after purchase' },
  { title: 'Email 2: Setup Guide', column: 'Follow-up', description: 'Day 1 - how to get started' },
  { title: 'Email 3: First Win', column: 'Follow-up', description: 'Day 3 - celebrate first review' },
  { title: 'Email 4: Case Study', column: 'Follow-up', description: 'Day 7 - show results from others' },
  { title: 'Email 5: Upsell', column: 'Follow-up', description: 'Day 14 - premium features' },
  { title: 'Email 6: Testimonial Request', column: 'Follow-up', description: 'Day 21 - ask for review' },
  { title: 'Email 7: Referral', column: 'Follow-up', description: 'Day 30 - referral program' },
  { title: 'Retargeting Ads', column: 'Follow-up', description: 'Facebook pixel + retargeting campaign' },
  { title: 'Non-Buyer Sequence', column: 'Follow-up', description: '3 emails for cart abandoners' }
];

const researchTasks = [
  { title: 'Market Analysis', column: 'Research', description: 'Who are the competitors? What do they charge?' },
  { title: 'Competitor Research', column: 'Research', description: 'Feature comparison + positioning' },
  { title: 'Pricing Validation', column: 'Research', description: 'Survey target market on willingness to pay' }
];

const deliveryTasks = [
  { title: 'Product MVP', column: 'Delivery', description: 'Build core review request system' },
  { title: 'Stripe Setup', column: 'Delivery', description: 'Payment processing + webhooks' },
  { title: 'GitHub Repo', column: 'Delivery', description: 'Create repo + initial commit' },
  { title: 'Vercel Deploy', column: 'Delivery', description: 'Deploy to production' },
  { title: 'GC Integration', column: 'Delivery', description: 'Connect with Global Control for SMS/Email' },
  { title: 'Review Platform APIs', column: 'Delivery', description: 'Google, Yelp, Facebook integrations' }
];

async function main() {
  console.log('🏗️ Creating ReviewRush business...\n');

  // Step 1: Get existing ReviewRush business or create new one
  let { data: existingBiz, error: fetchError } = await supabase
    .from('businesses')
    .select('*')
    .eq('name', 'ReviewRush')
    .single();

  let business;

  if (existingBiz) {
    console.log(`✅ Found existing business: ${existingBiz.name} (ID: ${existingBiz.id})`);
    business = existingBiz;
    
    // Clear existing cards
    await supabase
      .from('business_cards')
      .delete()
      .eq('business_id', business.id);
    console.log('🗑️ Cleared existing tasks');
  } else {
    // Get Chad's user_id from existing businesses
    const { data: anyBiz } = await supabase
      .from('businesses')
      .select('user_id')
      .limit(1)
      .single();

    const { data: newBiz, error: bizError } = await supabase
      .from('businesses')
      .insert([{
        name: 'ReviewRush',
        user_id: anyBiz?.user_id || '08dee908-d31b-4c19-ae7d-227ccbb068cf'
      }])
      .select()
      .single();

    if (bizError) {
      console.error('❌ Error creating business:', bizError);
      return;
    }

    business = newBiz;
    console.log(`✅ Business created: ${business.name} (ID: ${business.id})`);
  }

  // Step 2: Create all tasks
  const allTasks = [
    ...marketingTasks,
    ...followupTasks,
    ...researchTasks,
    ...deliveryTasks
  ];

  const cards = allTasks.map((task, index) => ({
    business_id: business.id,
    title: task.title,
    column_name: task.column,
    description: task.description,
    position: index,
    labels: [],
    user_id: business.user_id  // Use same user_id as business
  }));

  const { data: createdCards, error: cardsError } = await supabase
    .from('business_cards')
    .insert(cards)
    .select();

  if (cardsError) {
    console.error('❌ Error creating cards:', cardsError);
    return;
  }

  console.log(`✅ Created ${createdCards.length} tasks across 4 columns\n`);

  console.log('📊 Task Breakdown:');
  console.log(`   Marketing: ${marketingTasks.length} tasks`);
  console.log(`   Follow-up: ${followupTasks.length} tasks`);
  console.log(`   Research: ${researchTasks.length} tasks`);
  console.log(`   Delivery: ${deliveryTasks.length} tasks`);
  
  console.log('\n🔗 View at: https://vizard-clips-app.vercel.app/businesses');
  console.log('🎬 Starting work on first task: VSL Script...\n');
}

main().catch(console.error);

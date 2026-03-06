// Test Google Calendar API connection
const { google } = require('googleapis');
const fs = require('fs');

async function testCalendar() {
  try {
    // Load credentials
    const credentials = JSON.parse(fs.readFileSync('credentials/google-calendar-service-account.json', 'utf8'));
    
    console.log('Service Account:', credentials.client_email);
    console.log('Testing connection...\n');
    
    // Create auth client
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });
    
    const authClient = await auth.getClient();
    const calendar = google.calendar({ version: 'v3', auth: authClient });
    
    // List calendars
    const calendarList = await calendar.calendarList.list();
    
    console.log('✅ SUCCESS! Connected to Google Calendar API\n');
    console.log('Accessible Calendars:');
    
    calendarList.data.items.forEach(cal => {
      console.log(`  - ${cal.summary}`);
      console.log(`    ID: ${cal.id}`);
      console.log(`    Access: ${cal.accessRole}\n`);
    });
    
    // Save primary calendar info
    const primaryCal = calendarList.data.items.find(c => c.primary) || calendarList.data.items[0];
    if (primaryCal) {
      const calInfo = {
        calendar_id: primaryCal.id,
        calendar_name: primaryCal.summary,
        access_role: primaryCal.accessRole
      };
      fs.writeFileSync('credentials/google-calendar-id.json', JSON.stringify(calInfo, null, 2));
      console.log(`✅ Primary calendar saved: ${primaryCal.summary}`);
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    if (error.code === 403) {
      console.error('\n⚠️  Make sure you shared the calendar with:', credentials.client_email);
    }
    process.exit(1);
  }
}

testCalendar();

import { google } from 'googleapis';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, max-age=300',
  'Content-Type': 'application/json; charset=utf-8'
};

function env(name) {
  return globalThis.Netlify?.env?.get(name) || process.env[name] || '';
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders
  });
}

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'GET') {
    return json({ configured: false, items: [], message: 'Method not allowed' }, 405);
  }

  const clientEmail = env('GOOGLE_SERVICE_ACCOUNT_EMAIL');
  const privateKey = env('GOOGLE_PRIVATE_KEY');
  const calendarId = env('SANATORIO_CALENDAR_ID');

  if (!clientEmail || !privateKey || !calendarId) {
    return json({
      configured: false,
      items: [],
      message: 'Calendar coming soon - book via WhatsApp'
    });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n')
      },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly']
    });

    const calendar = google.calendar({ version: 'v3', auth });
    const { data } = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      timeMax: new Date(Date.now() + 30 * 86400000).toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });

    return json({
      configured: true,
      items: data.items || []
    });
  } catch (error) {
    console.error('calendar-availability failed', error);
    return json({
      configured: false,
      items: [],
      message: 'Calendar temporarily unavailable - book via WhatsApp'
    });
  }
};

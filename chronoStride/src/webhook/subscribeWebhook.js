import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

async function subscribe() {
  const url = 'https://www.strava.com/api/v3/push_subscriptions';
  const body = {
    client_id:     process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    callback_url:  process.env.STRAVA_CALLBACK_URL,
    verify_token:  process.env.STRAVA_VERIFY_TOKEN,
  };

  console.log('Registering webhook with Strava…');
  const res = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });

  const data = await res.json();
  if (res.ok) {
    console.log('✅ Subscription successful:', data);
  } else {
    console.error('❌ Subscription failed:', data);
  }
}

subscribe().catch(err => {
  console.error('Error running subscribeWebhook.js:', err);
  process.exit(1);
});

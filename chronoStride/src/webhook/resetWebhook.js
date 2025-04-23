// File: scripts/resetWebhook.js
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const {
  STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET,
  STRAVA_CALLBACK_URL,
  STRAVA_VERIFY_TOKEN
} = process.env;

async function reset() {
  // 1) List all existing push subscriptions
  const listRes = await fetch(
    `https://www.strava.com/api/v3/push_subscriptions?` +
    `client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}`
  );
  if (!listRes.ok) throw new Error(`Failed to list subscriptions: ${await listRes.text()}`);
  const subs = await listRes.json();

  // 2) Delete _every_ subscription by ID, using query params
  for (const sub of subs) {
    console.log(`🗑  Deleting subscription ${sub.id} → ${sub.callback_url}`);
    const delRes = await fetch(
      `https://www.strava.com/api/v3/push_subscriptions/${sub.id}` +
      `?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}`,
      { method: 'DELETE' }
    );
    if (!delRes.ok) {
      console.warn(`  ⚠️  Delete ${sub.id} returned ${delRes.status}: ${await delRes.text()}`);
    }
  }

  // 3) Create the new one
  console.log(`🔁 Registering webhook ${STRAVA_CALLBACK_URL}`);
  const createRes = await fetch('https://www.strava.com/api/v3/push_subscriptions', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      callback_url:  STRAVA_CALLBACK_URL,
      verify_token:  STRAVA_VERIFY_TOKEN
    }),
  });

  const data = await createRes.json();
  if (createRes.ok) {
    console.log('✅ Subscription successful:', data);
  } else {
    console.error('❌ Subscription failed:', data);
  }
}

reset().catch(err => {
  console.error('🔥 Error in resetWebhook:', err);
  process.exit(1);
});

import fetch from 'node-fetch';
export default async function sendLogsToDiscord(success, errorMessage) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return;
  const content = success
    ? '✅ **User Export Cron:** completed successfully'
    : `❌ **User Export Cron:** failed - ${errorMessage}`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
  } catch (err) {
    console.error('Failed to send Discord log:', err);
  }
}
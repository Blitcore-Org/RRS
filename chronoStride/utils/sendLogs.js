// sendLogs.js
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';
import logger from './logger.js';

export default async function sendLogsToDiscord() {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) {
    logger.warn('No DISCORD_WEBHOOK_URL; skipping log upload.');
    return;
  }

  try {
    const form = new FormData();
    form.append('file', fs.createReadStream('/tmp/cron.log'), 'cron.log');
    form.append('content', '📋 **Strava Cron Log**');

    const res = await fetch(url, { method: 'POST', body: form });
    if (!res.ok) {
      logger.error(`Discord webhook error: ${res.status} ${res.statusText}`);
    } else {
      logger.info('Logs uploaded to Discord successfully.');
    }
  } catch (err) {
    logger.error('Error sending logs to Discord:', err);
  }
}

import dotenv from 'dotenv';
dotenv.config();

import moment from 'moment-timezone';
moment.tz.setDefault('Europe/Sofia');
//moment.tz.setDefault("Africa/Lagos");


import express from 'express';
import bodyParser from 'body-parser';
import logger from '../utils/logger.js';
import connectDb from './db.js';
import { processSingleActivity } from './webhook/webhookProcessor.js';

async function startServer() {
  try {
    await connectDb();
  } catch (err) {
    logger.error('❌ Error connecting to MongoDB:', err);
    process.exit(1);
  }

  const app = express();
  app.use(bodyParser.json());

  app.get('/strava/webhook', (req, res) => {
    const mode      = req.query['hub.mode'];
    const token     = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.STRAVA_VERIFY_TOKEN) {
      logger.info('✅ Strava webhook verified');
      return res.json({ 'hub.challenge': challenge });
    }

    logger.warn('⚠️ Strava webhook verification failed');
    res.sendStatus(403);
  });

  app.post('/strava/webhook', (req, res) => {
    const { object_type, aspect_type, object_id, owner_id } = req.body;
    if (object_type === 'activity' && aspect_type === 'create') {
      logger.info(`🔔 Received new activity: user=${owner_id} activity=${object_id}`);
      processSingleActivity(owner_id, object_id)
        .catch(err => logger.error('Error in processSingleActivity:', err));
    }
    res.sendStatus(200);
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`🚀 Server listening on port ${PORT}`);
  });
}

startServer();

import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
import { google } from "googleapis";
import logger from "./logger.js";
import User from "./models/User.js";
import sendLogsToDiscord from "./sendLogs.js";

dotenv.config();

const {
  MONGODB_URI,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_DRIVE_FOLDER_ID,
  DISCORD_WEBHOOK_URL
} = process.env;

if (!MONGODB_URI || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN || !GOOGLE_DRIVE_FOLDER_ID) {
  throw new Error(
    "Missing required environment variables: MONGODB_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_DRIVE_FOLDER_ID"
  );
}

dateStr();
function dateStr() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

// DB connection cache
let cached = global.mongoose;
async function connectDb() {
  if (cached?.conn) return cached.conn;
  if (!cached) cached = global.mongoose = { conn: null, promise: null };
  cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  cached.conn = await cached.promise;
  logger.info("Connected to MongoDB");
  return cached.conn;
}

async function exportUsersToCSV() {
  const fileName = `${dateStr()}_users_export.csv`;
  const users = await User.find().lean();
  if (!users.length) return null;

  const csvWriter = createCsvWriter({ path: fileName, header: [
    { id: "id", title: "ID" },
    { id: "email", title: "Email" },
    { id: "name", title: "Name" },
    { id: "progress", title: "Progress" },
    { id: "totalDistance", title: "Total Distance" },
    { id: "totalTime", title: "Total Time" },
    { id: "averagePace", title: "Average Pace" },
    { id: "best5km", title: "Best 5km" },
    { id: "best10km", title: "Best 10km" },
    { id: "isAdmin", title: "Is Admin" },
    { id: "createdAt", title: "Created At" },
    { id: "updatedAt", title: "Updated At" }
  ]});

  const records = users.map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    progress: u.progress,
    totalDistance: u.totalDistance,
    totalTime: u.totalTime,
    averagePace: u.averagePace,
    best5km: u.best5km,
    best10km: u.best10km,
    isAdmin: u.isAdmin,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString()
  }));
  await csvWriter.writeRecords(records);
  logger.info(`Exported ${records.length} users to CSV: ${fileName}`);
  return fileName;
}

async function uploadToDrive(fileName) {
  const auth = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
  );
  auth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

  const drive = google.drive({ version: "v3", auth });
  const fileMetadata = {
    name: fileName,
    parents: [GOOGLE_DRIVE_FOLDER_ID]
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: { mimeType: "text/csv", body: fs.createReadStream(fileName) },
    fields: "id, webViewLink"
  });

  logger.info(`Uploaded to Drive: ${response.data.webViewLink}`);
  return response.data;
}

(async () => {
  let success = true, errorMsg = '';
  try {
    await connectDb();
    const csvFile = await exportUsersToCSV();
    if (csvFile) await uploadToDrive(csvFile);
  } catch (err) {
    success = false;
    errorMsg = err.message;
    logger.error("Export cron failed:", err);
  } finally {
    await sendLogsToDiscord(success, errorMsg);
    process.exit(0);
  }
})();

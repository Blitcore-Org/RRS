// ===== File: helpers.js =====
import moment from 'moment-timezone';

export function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

export function calculateDistance(lat1, lng1, lat2, lng2) {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function isWithinGeofence([lat, lng], center, radius) {
  if (lat == null || lng == null) return false;
  const distance = calculateDistance(lat, lng, center.lat, center.lng);
  return distance <= radius;
}

// parse "HH:mm" or just "H" into hours/minutes, defaulting missing minutes to 0
export function parseHhMm(str = '00:00') {
  const [h, m = '0'] = str.split(':');
  return { hour: Number(h), minute: Number(m) };
}

// Return local Unix timestamps (seconds) for startStr/endStr in provided moment's timezone
export function getUnixWindow(startStr, endStr, m = moment()) {
  const { hour: hS, minute: mS } = parseHhMm(startStr);
  const { hour: hE, minute: mE } = parseHhMm(endStr);

  const startLocal = m.clone().hour(hS).minute(mS).second(0).millisecond(0);
  const endLocal   = m.clone().hour(hE).minute(mE).second(0).millisecond(0);

  return [
    Math.floor(startLocal.valueOf() / 1000),
    Math.floor(endLocal.valueOf() / 1000)
  ];
}

export function parseHmsToSeconds(str = "00:00:00") {
  const [h, m, s] = (str.split(":").map(Number));
  return h*3600 + m*60 + s;
}

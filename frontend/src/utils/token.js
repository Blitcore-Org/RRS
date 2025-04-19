// utils/token.js
import jwt from 'jsonwebtoken';

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(token) {
  const decoded = jwt.decode(token);
  if (!decoded || !decoded.exp) return true;
  const now = Date.now() / 1000;
  return decoded.exp < now;
}

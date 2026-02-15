import { verifyToken } from '../services/supabaseAuthService.js';

export const authenticateSupabase = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const user = await verifyToken(token);
    req.user = { id: user.id, email: user.email }; // Match existing format
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Authentication middleware
export const requireAuth = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  try {
    // For now, we'll just pass through since we're using mock auth
    // In production, you would verify the JWT token here
    req.user = { id: '123' }; // Mock user ID
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default {
  requireAuth
};
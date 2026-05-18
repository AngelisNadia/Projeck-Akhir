import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'bantu-nyata';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Akses ditolak, kamu belum login!" 
    });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; 
    next(); 
  } catch (err) {
    res.status(403).json({ 
      success: false, 
      message: "Token sudah kadaluwarsa atau tidak valid" 
    });
  }
};
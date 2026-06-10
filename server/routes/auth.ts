import express from 'express';
import bcrypt from 'bcryptjs';
import { dbGet } from '../db';
import * as baseJwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'vrcar_super_secret_key_123'; 

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await dbGet('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = baseJwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = baseJwt.verify(token, JWT_SECRET) as any;
    res.json({ user: decoded });
  } catch(e) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;

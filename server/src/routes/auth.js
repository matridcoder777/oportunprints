const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { users } = require('../data/store');
const authMiddleware = require('../middleware/auth');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = users.find((u) => u.username === username && u.active);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    storeIds: user.storeIds,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

  return res.json({
    token,
    user: payload,
  });
});

router.post('/logout', (req, res) => {
  return res.json({ message: 'Logged out successfully' });
});

router.get('/me', authMiddleware, (req, res) => {
  const user = users.find((u) => u.id === req.user.id && u.active);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password, ...safeUser } = user;
  return res.json(safeUser);
});

module.exports = router;

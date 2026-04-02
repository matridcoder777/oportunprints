const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const { users } = require('../data/store');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/', (req, res) => {
  const safeUsers = users.map(({ password, ...u }) => u);
  return res.json(safeUsers);
});

router.post('/', (req, res) => {
  const { username, email, password, role, storeIds, firstName, lastName } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: 'username, email, password, and role are required' });
  }

  const exists = users.find((u) => u.username === username || u.email === email);
  if (exists) {
    return res.status(409).json({ message: 'Username or email already in use' });
  }

  const newUser = {
    id: uuidv4(),
    username,
    email,
    password: bcrypt.hashSync(password, 10),
    role,
    storeIds: storeIds || [],
    firstName: firstName || '',
    lastName: lastName || '',
    active: true,
  };

  users.push(newUser);

  const { password: _pw, ...safeUser } = newUser;
  return res.status(201).json(safeUser);
});

router.put('/:id', (req, res) => {
  const index = users.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { username, email, password, role, storeIds, firstName, lastName, active } = req.body;
  const updates = {};
  if (username !== undefined) updates.username = username;
  if (email !== undefined) updates.email = email;
  if (role !== undefined) updates.role = role;
  if (storeIds !== undefined) updates.storeIds = storeIds;
  if (firstName !== undefined) updates.firstName = firstName;
  if (lastName !== undefined) updates.lastName = lastName;
  if (active !== undefined) updates.active = active;
  if (password) updates.password = bcrypt.hashSync(password, 10);

  users[index] = { ...users[index], ...updates };

  const { password: _pw, ...safeUser } = users[index];
  return res.json(safeUser);
});

router.delete('/:id', (req, res) => {
  const index = users.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users[index].active = false;
  return res.json({ message: 'User deactivated' });
});

module.exports = router;

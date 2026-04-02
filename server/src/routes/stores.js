const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const { stores } = require('../data/store');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.get('/', authMiddleware, (req, res) => {
  const activeStores = stores.filter((s) => s.active);
  return res.json(activeStores);
});

router.post('/', authMiddleware, roleMiddleware('admin'), (req, res) => {
  const { name, address, city, state, zip, type, partner } = req.body;
  if (!name || !address || !city || !state || !zip) {
    return res.status(400).json({ message: 'name, address, city, state, and zip are required' });
  }

  const newStore = {
    id: uuidv4(),
    name,
    address,
    city,
    state,
    zip,
    type: type || 'retail',
    partner: partner || '',
    active: true,
  };

  stores.push(newStore);
  return res.status(201).json(newStore);
});

router.put('/:id', authMiddleware, roleMiddleware('admin'), (req, res) => {
  const index = stores.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Store not found' });
  }

  const { name, address, city, state, zip, type, partner, active } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (address !== undefined) updates.address = address;
  if (city !== undefined) updates.city = city;
  if (state !== undefined) updates.state = state;
  if (zip !== undefined) updates.zip = zip;
  if (type !== undefined) updates.type = type;
  if (partner !== undefined) updates.partner = partner;
  if (active !== undefined) updates.active = active;

  stores[index] = { ...stores[index], ...updates };
  return res.json(stores[index]);
});

router.delete('/:id', authMiddleware, roleMiddleware('admin'), (req, res) => {
  const index = stores.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Store not found' });
  }

  stores[index].active = false;
  return res.json({ message: 'Store deactivated' });
});

module.exports = router;

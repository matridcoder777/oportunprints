const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const { orders, products } = require('../data/store');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const VALID_STATUSES = ['pending', 'approved', 'rejected', 'sent_to_vendor', 'completed'];

router.get('/', authMiddleware, (req, res) => {
  const { status, storeId, userId } = req.query;
  const { role, id: currentUserId, storeIds: userStoreIds } = req.user;

  let result = orders.filter((o) => {
    if (role === 'vendor') {
      if (!['approved', 'sent_to_vendor', 'completed'].includes(o.status)) return false;
    } else if (role === 'store_manager' || role === 'multi_store') {
      if (o.userId !== currentUserId) return false;
    }
    if (status && o.status !== status) return false;
    if (storeId && o.storeId !== storeId) return false;
    if (userId && role === 'admin' && o.userId !== userId) return false;
    return true;
  });

  return res.json(result);
});

router.get('/:id', authMiddleware, (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const { role, id: currentUserId } = req.user;

  if (role === 'vendor' && !['approved', 'sent_to_vendor', 'completed'].includes(order.status)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  if ((role === 'store_manager' || role === 'multi_store') && order.userId !== currentUserId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  return res.json(order);
});

router.post('/', authMiddleware, roleMiddleware('admin', 'store_manager', 'multi_store'), (req, res) => {
  const { storeId, items } = req.body;
  if (!storeId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'storeId and a non-empty items array are required' });
  }

  const enrichedItems = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ message: `Product not found: ${item.productId}` });
    }
    enrichedItems.push({
      productId: item.productId,
      productName: product.name,
      sku: product.sku,
      quantity: item.quantity || 1,
    });
  }

  const now = new Date().toISOString();
  const newOrder = {
    id: uuidv4(),
    userId: req.user.id,
    storeId,
    items: enrichedItems,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  orders.push(newOrder);
  return res.status(201).json(newOrder);
});

router.put('/:id/status', authMiddleware, roleMiddleware('admin'), (req, res) => {
  const { status } = req.body;
  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  const index = orders.findIndex((o) => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  orders[index].status = status;
  orders[index].updatedAt = new Date().toISOString();
  return res.json(orders[index]);
});

router.put('/:id', authMiddleware, roleMiddleware('admin'), (req, res) => {
  const index = orders.findIndex((o) => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const { storeId, items } = req.body;
  const updates = {};
  if (storeId !== undefined) updates.storeId = storeId;
  if (Array.isArray(items)) {
    const enrichedItems = [];
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.productId}` });
      }
      enrichedItems.push({
        productId: item.productId,
        productName: product.name,
        sku: product.sku,
        quantity: item.quantity || 1,
      });
    }
    updates.items = enrichedItems;
  }

  orders[index] = { ...orders[index], ...updates, id: orders[index].id, updatedAt: new Date().toISOString() };
  return res.json(orders[index]);
});

module.exports = router;

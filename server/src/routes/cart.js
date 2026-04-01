const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const { carts, products } = require('../data/store');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

function getOrCreateCart(userId) {
  let cart = carts.find((c) => c.userId === userId);
  if (!cart) {
    cart = { id: uuidv4(), userId, items: [] };
    carts.push(cart);
  }
  return cart;
}

router.get('/', (req, res) => {
  const cart = carts.find((c) => c.userId === req.user.id);
  return res.json(cart || { userId: req.user.id, items: [] });
});

router.post('/items', (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'productId and a positive quantity are required' });
  }

  const product = products.find((p) => p.id === productId && p.status === 'active');
  if (!product) {
    return res.status(404).json({ message: 'Product not found or unavailable' });
  }

  const cart = getOrCreateCart(req.user.id);
  const existing = cart.items.find((i) => i.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      productName: product.name,
      sku: product.sku,
      quantity,
    });
  }

  return res.json(cart);
});

router.put('/items/:productId', (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'A positive quantity is required' });
  }

  const cart = carts.find((c) => c.userId === req.user.id);
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const item = cart.items.find((i) => i.productId === req.params.productId);
  if (!item) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }

  item.quantity = quantity;
  return res.json(cart);
});

router.delete('/items/:productId', (req, res) => {
  const cart = carts.find((c) => c.userId === req.user.id);
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const itemIndex = cart.items.findIndex((i) => i.productId === req.params.productId);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }

  cart.items.splice(itemIndex, 1);
  return res.json(cart);
});

router.delete('/', (req, res) => {
  const cart = carts.find((c) => c.userId === req.user.id);
  if (cart) {
    cart.items = [];
  }
  return res.json({ message: 'Cart cleared' });
});

module.exports = router;

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const { products } = require('../data/store');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.get('/', authMiddleware, (req, res) => {
  const { category, campaign, storeType, partner, search } = req.query;
  const isVendor = req.user.role === 'vendor';

  let result = products.filter((p) => {
    if (isVendor && p.status !== 'active') return false;
    if (category && p.category !== category) return false;
    if (campaign && p.campaign !== campaign) return false;
    if (storeType && p.storeType !== storeType) return false;
    if (partner && p.partner !== partner) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return res.json(result);
});

router.get('/:id', authMiddleware, (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  if (req.user.role === 'vendor' && product.status !== 'active') {
    return res.status(404).json({ message: 'Product not found' });
  }
  return res.json(product);
});

router.post('/', authMiddleware, roleMiddleware('admin'), (req, res) => {
  const { name, sku, category, campaign, storeType, partner, language, status, imageUrl, internalNotes, description } = req.body;
  if (!name || !sku || !category) {
    return res.status(400).json({ message: 'name, sku, and category are required' });
  }

  const skuExists = products.find((p) => p.sku === sku);
  if (skuExists) {
    return res.status(409).json({ message: 'SKU already in use' });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    sku,
    category,
    campaign: campaign || '',
    storeType: storeType || 'retail',
    partner: partner || '',
    language: language || 'English',
    status: status || 'active',
    imageUrl: imageUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(name)}`,
    internalNotes: internalNotes || '',
    description: description || '',
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);
  return res.status(201).json(newProduct);
});

router.put('/:id', authMiddleware, roleMiddleware('admin'), (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { name, sku, category, campaign, storeType, partner, language, status, imageUrl, internalNotes, description } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (sku !== undefined) {
    const skuConflict = products.find((p) => p.sku === sku && p.id !== req.params.id);
    if (skuConflict) {
      return res.status(409).json({ message: 'SKU already in use by another product' });
    }
    updates.sku = sku;
  }
  if (category !== undefined) updates.category = category;
  if (campaign !== undefined) updates.campaign = campaign;
  if (storeType !== undefined) updates.storeType = storeType;
  if (partner !== undefined) updates.partner = partner;
  if (language !== undefined) updates.language = language;
  if (status !== undefined) updates.status = status;
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  if (internalNotes !== undefined) updates.internalNotes = internalNotes;
  if (description !== undefined) updates.description = description;

  products[index] = { ...products[index], ...updates };
  return res.json(products[index]);
});

router.delete('/:id', authMiddleware, roleMiddleware('admin'), (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products[index].status = 'retired';
  return res.json({ message: 'Product retired', product: products[index] });
});

module.exports = router;

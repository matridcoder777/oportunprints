const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { templates } = require('../data/mockData');

const router = express.Router();

// GET /api/templates
router.get('/', (req, res) => {
  res.json(templates);
});

// GET /api/templates/:id
router.get('/:id', (req, res) => {
  const tpl = templates.find((t) => t.id === req.params.id);
  if (!tpl) return res.status(404).json({ error: 'Template not found' });
  res.json(tpl);
});

// POST /api/templates
router.post('/', (req, res) => {
  const { name, description, category, paperSize, orientation, colorMode } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'name and category are required' });
  }
  const newTemplate = {
    id: `tpl-${uuidv4()}`,
    name,
    description: description || '',
    category,
    paperSize: paperSize || 'Letter',
    orientation: orientation || 'portrait',
    colorMode: colorMode || 'color',
    createdAt: new Date().toISOString(),
  };
  templates.push(newTemplate);
  res.status(201).json(newTemplate);
});

// PUT /api/templates/:id
router.put('/:id', (req, res) => {
  const index = templates.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Template not found' });
  templates[index] = {
    ...templates[index],
    ...req.body,
    id: templates[index].id,
    createdAt: templates[index].createdAt,
  };
  res.json(templates[index]);
});

// DELETE /api/templates/:id
router.delete('/:id', (req, res) => {
  const index = templates.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Template not found' });
  templates.splice(index, 1);
  res.status(204).send();
});

module.exports = router;

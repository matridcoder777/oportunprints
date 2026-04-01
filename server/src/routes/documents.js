const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { documents } = require('../data/mockData');

const router = express.Router();

// GET /api/documents
router.get('/', (req, res) => {
  res.json(documents);
});

// GET /api/documents/:id
router.get('/:id', (req, res) => {
  const doc = documents.find((d) => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  res.json(doc);
});

// POST /api/documents
router.post('/', (req, res) => {
  const { title, type, status, pages, fileSize } = req.body;
  if (!title || !type) {
    return res.status(400).json({ error: 'title and type are required' });
  }
  const now = new Date().toISOString();
  const newDoc = {
    id: `doc-${uuidv4()}`,
    title,
    type,
    status: status || 'active',
    pages: pages || 1,
    fileSize: fileSize || 'Unknown',
    createdAt: now,
    updatedAt: now,
  };
  documents.push(newDoc);
  res.status(201).json(newDoc);
});

// PUT /api/documents/:id
router.put('/:id', (req, res) => {
  const index = documents.findIndex((d) => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Document not found' });
  documents[index] = {
    ...documents[index],
    ...req.body,
    id: documents[index].id,
    updatedAt: new Date().toISOString(),
  };
  res.json(documents[index]);
});

// DELETE /api/documents/:id
router.delete('/:id', (req, res) => {
  const index = documents.findIndex((d) => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Document not found' });
  documents.splice(index, 1);
  res.status(204).send();
});

module.exports = router;

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { printJobs, documents, templates } = require('../data/mockData');

const router = express.Router();

const VALID_STATUSES = ['pending', 'processing', 'completed', 'failed'];

// GET /api/print-jobs
router.get('/', (req, res) => {
  const { status } = req.query;
  if (status) {
    return res.json(printJobs.filter((j) => j.status === status));
  }
  res.json(printJobs);
});

// GET /api/print-jobs/:id
router.get('/:id', (req, res) => {
  const job = printJobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Print job not found' });
  res.json(job);
});

// POST /api/print-jobs
router.post('/', (req, res) => {
  const { documentId, templateId, copies, submittedBy, printer } = req.body;
  if (!documentId || !templateId || !copies) {
    return res.status(400).json({ error: 'documentId, templateId, and copies are required' });
  }
  const doc = documents.find((d) => d.id === documentId);
  const tpl = templates.find((t) => t.id === templateId);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  if (!tpl) return res.status(404).json({ error: 'Template not found' });

  const newJob = {
    id: `job-${uuidv4()}`,
    documentId,
    documentTitle: doc.title,
    templateId,
    templateName: tpl.name,
    status: 'pending',
    copies: Number(copies),
    submittedAt: new Date().toISOString(),
    completedAt: null,
    submittedBy: submittedBy || 'Unknown User',
    printer: printer || 'Default Printer',
  };
  printJobs.push(newJob);
  res.status(201).json(newJob);
});

// PUT /api/print-jobs/:id/status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }
  const index = printJobs.findIndex((j) => j.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Print job not found' });

  printJobs[index].status = status;
  if (status === 'completed') {
    printJobs[index].completedAt = new Date().toISOString();
  }
  res.json(printJobs[index]);
});

// DELETE /api/print-jobs/:id
router.delete('/:id', (req, res) => {
  const index = printJobs.findIndex((j) => j.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Print job not found' });
  printJobs.splice(index, 1);
  res.status(204).send();
});

module.exports = router;

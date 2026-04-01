require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { documents, templates, printJobs } = require('./data/mockData');
const documentsRouter = require('./routes/documents');
const templatesRouter = require('./routes/templates');
const printJobsRouter = require('./routes/printJobs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/documents', documentsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/print-jobs', printJobsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalDocuments: documents.length,
    totalTemplates: templates.length,
    pendingJobs: printJobs.filter((j) => j.status === 'pending').length,
    processingJobs: printJobs.filter((j) => j.status === 'processing').length,
    completedJobs: printJobs.filter((j) => j.status === 'completed').length,
    failedJobs: printJobs.filter((j) => j.status === 'failed').length,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

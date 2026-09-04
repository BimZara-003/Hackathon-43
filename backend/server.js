const express = require('express');
const cors = require('cors');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const reportController = require('./controllers/reportController');

app.get('/', (req, res) => {
  res.json({
    message: 'Mithuru Mawatha API is running',
    documentation: 'See backend/API.md in the project repository',
  });
});

app.get('/stats', reportController.getStats);

app.use('/reports', reportRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'Request body must contain valid JSON' });
  }

  console.error(error);
  return res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Mithuru Mawatha API running on port ${PORT}`);
  });
}

module.exports = app;

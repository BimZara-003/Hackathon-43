require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const reportStore = require('./models/reportStore');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');
const reportController = require('./controllers/reportController');

const app = express();
let databaseInitialization;

async function initializeDatabase() {
  if (process.env.SKIP_DATABASE === 'true') return false;

  if (!databaseInitialization) {
    databaseInitialization = connectDB().then(async (connected) => {
      if (connected) {
        await reportStore.seedDatabaseIfEmpty();
      }
      return connected;
    });
  }

  return databaseInitialization;
}

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({
    message: 'Mithuru Mawatha API is running',
    documentation: 'See backend/API.md in the project repository',
  });
});

app.use(async (req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

app.get('/stats', reportController.getStats);

app.use('/auth', authRoutes);
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

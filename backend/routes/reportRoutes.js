const express = require('express');
const reportController = require('../controllers/reportController');

const router = express.Router();

router.get('/', reportController.listReports);
router.post('/', reportController.addReport);
router.post('/analyze', reportController.analyzeReport);
router.get('/stats', reportController.getStats);
router.get('/:id', reportController.getReport);
router.patch('/:id/status', reportController.changeStatus);
router.post('/:id/upvote', reportController.upvote);
router.patch('/:id/verify', reportController.verifyReport);
router.patch('/:id/priority', reportController.setPriority);

module.exports = router;

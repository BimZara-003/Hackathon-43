const express = require('express');
const reportController = require('../controllers/reportController');

const router = express.Router();

router.get('/', reportController.listReports);
router.post('/', reportController.addReport);
router.get('/:id', reportController.getReport);
router.patch('/:id/status', reportController.changeStatus);
router.post('/:id/upvote', reportController.upvote);

module.exports = router;

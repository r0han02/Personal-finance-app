const { Router } = require('express');
const summaryController = require('../controllers/summaryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', summaryController.getSummary);

module.exports = router;

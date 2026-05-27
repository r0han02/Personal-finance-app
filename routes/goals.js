const { Router } = require('express');
const { body } = require('express-validator');
const goalController = require('../controllers/goalController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = Router();

router.use(authMiddleware);

router.get('/', goalController.getAll);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Goal name is required.'),
    body('target_amount').isFloat({ gt: 0 }).withMessage('Target amount must be a positive number.'),
    body('deadline').isISO8601().withMessage('Deadline must be a valid ISO 8601 date.'),
  ],
  validate,
  goalController.create
);

router.patch(
  '/:id',
  [
    body('current_amount')
      .isFloat({ min: 0 })
      .withMessage('Current amount must be a non-negative number.'),
  ],
  validate,
  goalController.updateAmount
);

router.delete('/:id', goalController.remove);

module.exports = router;

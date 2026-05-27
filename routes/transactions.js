const { Router } = require('express');
const { body } = require('express-validator');
const txnController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = Router();

// All transaction routes are protected
router.use(authMiddleware);

const txnValidation = [
  body('type').isIn(['income', 'expense']).withMessage("Type must be 'income' or 'expense'."),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number.'),
  body('category').trim().notEmpty().withMessage('Category is required.'),
  body('date').isISO8601().withMessage('Date must be a valid ISO 8601 date (YYYY-MM-DD).'),
  body('note').optional().isString(),
];

router.get('/', txnController.getAll);
router.post('/', txnValidation, validate, txnController.create);
router.put('/:id', txnValidation, validate, txnController.update);
router.delete('/:id', txnController.remove);

module.exports = router;

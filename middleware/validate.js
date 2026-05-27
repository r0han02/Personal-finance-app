const { validationResult } = require('express-validator');

/**
 * Reusable middleware that checks express-validator results.
 * Returns a 422 with all error messages if validation fails.
 */
function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      data: null,
      message: errors.array().map((e) => e.msg).join(' | '),
    });
  }

  next();
}

module.exports = validate;

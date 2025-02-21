const { validationResult } = require('express-validator');

const validate = (validations) => async (req, res, next) => {
  // Run all validations
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // Format validation errors
  const formattedErrors = errors.array().map((error) => ({
    field: error.param,
    message: error.msg
  }));

  return res.status(400).json({
    error: {
      message: 'Validation Error',
      status: 400,
      details: formattedErrors
    }
  });
};

module.exports = validate;

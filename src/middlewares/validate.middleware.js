import Joi from 'joi';

export const validate = (schema, { source = 'body' } = {}) => {
  return async (req, res, next) => {
    try {
      const value = await schema.validateAsync(req[source], {
        abortEarly: false,
        stripUnknown: true,
      });
      req[source] = value;
      next();
    } catch (err) {
      return res.status(400).json({
        message: 'Erreur de validation',
        details: err.details.map(d => d.message),
      });
    }
  };
};

import Joi from 'joi';

export const alertLoginSchema = Joi.object({
    to: Joi.string().email().required(),
    username: Joi.string().required()
});

export const alertSigninSchema = Joi.object({
    to: Joi.string().email().required(),
    username: Joi.string().required()
});

export const resetPasswordSchema = Joi.object({
    to: Joi.string().email().required(),
    username: Joi.string().required(),
    resetLink: Joi.string().uri().required()
});
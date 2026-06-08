const Joi = require('joi');

const loginSchema = Joi.object({
    username: Joi.string().trim().required(),
    password: Joi.string().required(),
});

const cambiarPasswordSchema = Joi.object({
    passwordActual: Joi.string().required(),
    passwordNueva: Joi.string().min(6).required(),
    passwordConfirmacion: Joi.string().valid(Joi.ref('passwordNueva')).required().messages({
        'any.only': 'La confirmación no coincide con la nueva contraseña.',
    }),
});

module.exports = {
    loginSchema,
    cambiarPasswordSchema,
};

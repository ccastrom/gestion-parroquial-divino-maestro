const Joi = require('joi');

const registrarHistoricoWebSchema = Joi.object({
    // Bautizado — nombre y apellido obligatorios
    bautizado_nombre:          Joi.string().trim().min(1).required(),
    bautizado_apellido:        Joi.string().trim().min(1).required(),
    bautizado_rut:             Joi.string().trim().uppercase().empty('').default(null).optional(),
    bautizado_fecha_nacimiento: Joi.date().empty('').max('now').default(null).optional(),
    bautizado_lugar_nacimiento: Joi.string().trim().empty('').default(null).optional(),
    bautizado_direccion:       Joi.string().trim().empty('').default(null).optional(),

    // Padre — ambos opcionales, pero si viene nombre debe venir apellido y viceversa
    padre_nombre:   Joi.string().trim().empty('').default(null).optional(),
    padre_apellido: Joi.string().trim().empty('').default(null).optional(),

    // Madre
    madre_nombre:   Joi.string().trim().empty('').default(null).optional(),
    madre_apellido: Joi.string().trim().empty('').default(null).optional(),

    // Padrino/Madrina — uno o varios (array cuando hay más de uno)
    padrino_nombre:   Joi.alternatives([
        Joi.string().trim().empty('').allow(''),
        Joi.array().items(Joi.string().trim().empty('').allow(''))
    ]).optional(),
    padrino_apellido: Joi.alternatives([
        Joi.string().trim().empty('').allow(''),
        Joi.array().items(Joi.string().trim().empty('').allow(''))
    ]).optional(),
});

module.exports = { registrarHistoricoWebSchema };

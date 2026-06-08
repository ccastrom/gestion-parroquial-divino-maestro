const Joi = require('joi');


const crearPersonaSchema = Joi.object({
    nombre:Joi.string().trim().min(1).required(),
    apellido:Joi.string().trim().min(1).required(),
    fecha_nacimiento: Joi.date().max('now').allow(null).optional(),
    rut: Joi.string().trim().uppercase().allow(null,'').optional().default(null),
    fono: Joi.string().trim().allow(null,'').optional(),
    direccion: Joi.string().trim().allow(null,'').optional(),  
}).unknown(false);


const crearPersonaWebSchema = Joi.object({
    nombre: Joi.string().trim().min(1).required(),
    apellido: Joi.string().trim().min(1).required(),
    rut: Joi.string().trim().uppercase().empty('').default(null).optional(),
    fecha_nacimiento: Joi.date().max('now').empty('').default(null).optional(),
    fono: Joi.string().trim().empty('').default(null).optional(),
    direccion: Joi.string().trim().empty('').default(null).optional(),
    tipo: Joi.string().valid('catequista', 'celebrante').empty('').default(null).optional(),
    observaciones: Joi.string().trim().empty('').default(null).optional(),
    origen: Joi.string().valid('detalle', 'personas').empty('').optional(),
    tramiteId: Joi.number().integer().positive().empty('').optional(),
});

module.exports = {
    crearPersonaSchema,
    crearPersonaWebSchema
};
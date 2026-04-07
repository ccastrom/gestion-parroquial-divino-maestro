const Joi = require('joi');


const crearPersonaSchema = Joi.object({
    nombre:Joi.string().trim().min(1).required(),
    apellido:Joi.string().trim().min(1).required(),
    fecha_nacimiento: Joi.date().max('now').allow(null).optional(),
    rut: Joi.string().trim().uppercase().allow(null,'').optional().default(null),
    fono: Joi.string().trim().allow(null,'').optional(),
    direccion: Joi.string().trim().allow(null,'').optional(),  
}).unknown(false);


module.exports = {
    crearPersonaSchema
};
const Joi = require('joi');


const crearPersonaSchema = Joi.object({
    nombre: Joi.string().required(),
    apellido: Joi.string().required(),
    fecha_nacimiento: Joi.date().required(),
    rut: Joi.string().allow(null),
    fono: Joi.string().allow(null),
    direccion: Joi.string().allow(null),  
});

const actualizarPersonaSchema = Joi.object({
    nombre: Joi.string(),
    apellido: Joi.string(),
    fecha_nacimiento: Joi.date(),
    rut: Joi.string().allow(null),
    fono: Joi.string().allow(null),
    direccion: Joi.string().allow(null),  
}).min(1);



module.exports = {
    crearPersonaSchema,
    actualizarPersonaSchema
};
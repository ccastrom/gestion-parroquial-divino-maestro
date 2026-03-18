const Joi = require('joi');


const crearPersonaSchema = Joi.object({
    nombre: Joi.string().required(),
    apellido: Joi.string().required(),
    fecha_nacimiento: Joi.date().allow(null,"").optional(),
    rut: Joi.string().allow(null,"").optional(),
    fono: Joi.string().allow(null,"").optional(),
    direccion: Joi.string().allow(null,"").optional(),  
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
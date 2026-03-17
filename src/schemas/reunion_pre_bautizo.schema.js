const joi=require('joi');
const {ESTADOS_VALIDOS}= require('../constants/estados_tramites');

const actualizarReunionSchema = Joi.object({
    fecha: Joi.date().allow(null),
    id_fk_persona: Joi.number().integer().positive().allow(null),
    estado: Joi.string().valid(...Object.values(ESTADOS_VALIDOS)).required()
});



module.exports={
    actualizarReunionSchema
}
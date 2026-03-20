const Joi=require('joi');
const {ESTADOS_VALIDOS}= require('../constants/estados_tramites');

const actualizarReunionSchema = Joi.object({
    fecha: Joi.date().allow(null,"").optional(),
    id_fk_persona_catequista: Joi.number().integer().positive().allow(null),
    estado: Joi.string().valid(...Object.values(ESTADOS_VALIDOS)).required()
});



module.exports={
    actualizarReunionSchema
}
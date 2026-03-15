const joi=require('joi');
const {ESTADOS_VALIDOS}= require('../constants/estados_tramites');

const actualizarReunionSchema = Joi.object({
    fecha: Joi.date().required(),
    id_fk_catequista: Joi.number().integer().positive().required(),
    estado: Joi.string().valid(...Object.values(ESTADOS_VALIDOS)).required()
});



module.exports={
    actualizarReunionSchema
}
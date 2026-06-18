const Joi = require('joi');

const documentoParticipante= Joi.object({
    tipo_documento: Joi.string().allow(null,"").optional(),
    fecha_entrega: Joi.date().allow(null,"").optional(),
    estado_documento: Joi.string().allow(null,"").optional()

});

const documentoWebSchema = Joi.object({
    id_participacion: Joi.number().integer().positive().optional(),
    tipo_documento: Joi.string().trim().empty('').default(null).optional(),
    estado_documento: Joi.string().trim().required(),
    fecha_entrega: Joi.date().empty('').default(null).optional(),
});

module.exports={
    documentoParticipante,
    documentoWebSchema
}
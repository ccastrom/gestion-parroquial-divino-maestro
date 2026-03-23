const Joi = require('joi');

const documentoParticipante= Joi.object({
    tipo_documento: Joi.string().allow(null,"").optional(),
    fecha_entrega: Joi.date().allow(null,"").optional(),
    estado_documento: Joi.string().allow(null,"").optional()

});



module.exports={
    documentoParticipante
}
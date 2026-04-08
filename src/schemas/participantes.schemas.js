const Joi = require('joi');

const personaNueva = Joi.object({
    personaId: Joi.number().integer().positive(),
    persona: Joi.object({
       nombre:Joi.string().trim().min(1).required(),
        apellido:Joi.string().trim().min(1).required(),
        fecha_nacimiento: Joi.date().max('now').when(Joi.ref('/rol'),{
            is:'Bautizado',
            then:Joi.required(),
            otherwise:Joi.allow(null),
        }),
        rut: Joi.string().trim().uppercase().when(Joi.ref('/rol'),{
            is:'Bautizado',
            then:Joi.required(),
            otherwise:Joi.allow(null),
        }),
        fono:  Joi.string().trim().allow(null,'').optional(),
        direccion: Joi.string().trim().allow(null,'').optional(),  
    }),
    rol: Joi.string().trim().required()
}).xor('personaId', 'persona');


module.exports = {
     agregarParticipanteSchema: personaNueva
}
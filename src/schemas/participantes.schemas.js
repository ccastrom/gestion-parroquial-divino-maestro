const Joi = require('joi');

const personaNueva = Joi.object({
    personaId: Joi.number().integer().positive(),
    persona: Joi.object({
        nombre: Joi.string().required(),
        apellido: Joi.string().required(),
        fecha_nacimiento: Joi.date().when(Joi.ref('/rol'),{
            is:'Bautizado',
            then:Joi.required(),
            otherwise:Joi.allow(null),
        }),
        rut: Joi.string().when(Joi.ref('/rol'),{
            is:'Bautizado',
            then:Joi.required(),
            otherwise:Joi.allow(null),
        }),
        fono: Joi.string().allow(null),
        direccion: Joi.string().allow(null),  
    }),
    rol: Joi.string().required()
}).xor('personaId', 'persona');


module.exports = {
     agregarParticipanteSchema: personaNueva
}
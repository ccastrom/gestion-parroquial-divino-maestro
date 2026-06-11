const Joi = require('joi');
const { ROLES_VALIDOS } = require('../constants/roles_Participantes');

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

const agregarParticipanteWebSchema = Joi.object({
    rol: Joi.string().trim().required(),
    personaId: Joi.number().integer().positive(),
    nombre: Joi.string().trim().min(1).when('personaId', {
        is: Joi.exist(),
        then: Joi.forbidden(),
        otherwise: Joi.required(),
    }),
    apellido: Joi.string().trim().min(1).when('personaId', {
        is: Joi.exist(),
        then: Joi.forbidden(),
        otherwise: Joi.required(),
    }),
    rut: Joi.string().trim().uppercase().when('personaId', {
        is: Joi.exist(),
        then: Joi.forbidden(),
        otherwise: Joi.when('rol', {
            is: 'Bautizado',
            then: Joi.string().trim().uppercase().empty('').required(),
            otherwise: Joi.string().empty('').default(null).optional(),
        }),
    }),
    fecha_nacimiento: Joi.date().empty('').max('now').when('personaId', {
        is: Joi.exist(),
        then: Joi.date().empty('').default(null).optional(),
        otherwise: Joi.when('rol', {
            is: 'Bautizado',
            then: Joi.required(),
            otherwise: Joi.date().empty('').default(null).optional(),
        }),
    }),
    fono: Joi.string().trim().empty('').default(null).optional(),
    direccion: Joi.string().trim().empty('').default(null).optional(),
    observaciones: Joi.string().trim().empty('').default(null).optional(),
    lugar_nacimiento: Joi.string().trim().empty('').default(null).optional(),
});

const editarRolParticipanteWebSchema = Joi.object({
    rol: Joi.string().trim().valid(...Object.values(ROLES_VALIDOS)).required(),
});

module.exports = {
    agregarParticipanteSchema: personaNueva,
    agregarParticipanteWebSchema,
    editarRolParticipanteWebSchema,
}
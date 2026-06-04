const {Router} = require('express');
const {POST_Tramites_Web,
    GET_Tramites_Web,
    GET_TramitesById_Web,
    POST_CambiarEstado_Web,
    POST_eliminarTramite_Web,
    POST_restaurarTramite_Web,
    POST_CambiarReunion_Web,
    POST_CompletarReunion_Web,
    POST_AgregarDocumento_Web,
    POST_ModificarDocumento_Web,
    POST_CrearParticipante_Web,
    GET_Personas_Web,
    GET_CalendarioTramites_Web,
    POST_CrearPersona_Web,
    POST_EditarPersona_Web } = require('../controllers/web.controllers.js');
const { validarBodyWeb } = require('../middleware/validarBodyWeb.js');
const { agregarParticipanteWebSchema } = require('../schemas/participantes.schemas.js');
const { crearPersonaWebSchema } = require('../schemas/persona.schema.js');

const router= Router();
router.post('/tramites', POST_Tramites_Web);
router.get('/', GET_Tramites_Web);
router.get('/tramites/:id', GET_TramitesById_Web);
router.post('/tramites/:id/eliminar', POST_eliminarTramite_Web);
router.post('/tramites/:id/restaurar',POST_restaurarTramite_Web);
router.get('/calendario',GET_CalendarioTramites_Web);
router.post('/tramites/:id/estado', POST_CambiarEstado_Web);
router.post('/tramites/:id/reunion', POST_CambiarReunion_Web);
router.post('/tramites/:id/completar-reunion', POST_CompletarReunion_Web);
router.post('/tramites/:id/documento', POST_AgregarDocumento_Web);
router.post('/tramites/:id/documento/:idDocumento', POST_ModificarDocumento_Web);
router.post('/tramites/:id/participantes', validarBodyWeb(agregarParticipanteWebSchema), POST_CrearParticipante_Web);
router.get('/personas', GET_Personas_Web);
router.post('/personas', validarBodyWeb(crearPersonaWebSchema), POST_CrearPersona_Web);
router.post('/personas/:id', validarBodyWeb(crearPersonaWebSchema), POST_EditarPersona_Web);


module.exports=router;
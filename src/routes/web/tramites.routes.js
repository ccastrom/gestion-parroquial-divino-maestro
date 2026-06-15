const { Router } = require('express');
const {
    POST_Tramites_Web,
    GET_TramitesById_Web,
    POST_CrearParticipante_Web,
    POST_EditarRolParticipante_Web,
    POST_EliminarParticipante_Web,
    POST_AgregarDocumento_Web,
    POST_ModificarDocumento_Web,
    POST_CambiarReunion_Web,
    POST_CompletarReunion_Web,
    POST_CambiarEstado_Web,
    POST_eliminarTramite_Web,
    POST_restaurarTramite_Web,
    POST_RegistrarHistorico_Web,
} = require('../../controllers/web.controllers.js');
const { validarBodyWeb } = require('../../middleware/validarBodyWeb.js');
const { agregarParticipanteWebSchema, editarRolParticipanteWebSchema } = require('../../schemas/participantes.schemas.js');
const { registrarHistoricoWebSchema } = require('../../schemas/historico.schema.js');

const router = Router();

// Ruta estática primero — evita que Express resuelva "historico" como :id
router.post('/historico', validarBodyWeb(registrarHistoricoWebSchema), POST_RegistrarHistorico_Web);

// 1. Crear y ver
router.post('/',    POST_Tramites_Web);
router.get('/:id',  GET_TramitesById_Web);

// 2. Participantes
router.post('/:id/participantes',                               validarBodyWeb(agregarParticipanteWebSchema), POST_CrearParticipante_Web);
router.post('/:id/participacion/:idParticipacion/rol',          validarBodyWeb(editarRolParticipanteWebSchema), POST_EditarRolParticipante_Web);
router.post('/:id/participacion/:idParticipacion/eliminar',     POST_EliminarParticipante_Web);

// 3. Documentos
router.post('/:id/documento',               POST_AgregarDocumento_Web);
router.post('/:id/documento/:idDocumento',  POST_ModificarDocumento_Web);

// 4. Reunión prebautismal
router.post('/:id/reunion',             POST_CambiarReunion_Web);
router.post('/:id/completar-reunion',   POST_CompletarReunion_Web);

// 5. Estado y fecha de bautismo
router.post('/:id/estado', POST_CambiarEstado_Web);

// 6. Archivar / restaurar
router.post('/:id/eliminar',  POST_eliminarTramite_Web);
router.post('/:id/restaurar', POST_restaurarTramite_Web);

module.exports = router;

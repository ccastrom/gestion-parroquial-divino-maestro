
const { agregarParticipanteSchema}= require('../schemas/participantes.schemas.js');
const {actualizarReunionSchema}= require('../schemas/reunion_pre_bautizo.schema.js');
const {validateBody}= require('../middleware/validarBody.js');
const {Router} = require('express');
const
{   GET_Tramites,
    GET_TramitesById,
    POST_Tramites,
    POST_Tramites_Agregar_Participantes,
    PATCH_Tramites,
    PUT_ReunionById,
    completarReunion
}=require('../controllers/tramites.controllers');
const router= Router();

router.post('/',POST_Tramites);
router.get('/',GET_Tramites);
router.post('/:id/participantes',validateBody(agregarParticipanteSchema),POST_Tramites_Agregar_Participantes);
router.get('/:id',GET_TramitesById);
router.patch('/:id/estado',PATCH_Tramites);
router.put('/:id/reunion',validateBody(actualizarReunionSchema),PUT_ReunionById)
router.patch('/:id/reunion',validateBody(actualizarReunionSchema),completarReunion)

module.exports = router;
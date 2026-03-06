
const {Router} = require('express');
const
{   GET_Tramites,
    GET_TramitesById,
    GET_Test_TramitesParticipacion,
    POST_Tramites,
    POST_Tramites_Agregar_Participantes,
    PATCH_Tramites
}=require('../controllers/tramites.controllers');
const router= Router();

router.get('/',GET_Tramites);
router.get('/test',GET_Test_TramitesParticipacion);
router.get('/:id',GET_TramitesById);
router.post('/',POST_Tramites);
router.post('/:id/participantes', POST_Tramites_Agregar_Participantes);
router.patch('/:id/estado',PATCH_Tramites);

module.exports = router;
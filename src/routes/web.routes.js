const {Router} = require('express');
const {POST_Tramites_Web, 
    GET_Tramites_Web, 
    GET_TramitesById_Web, 
    POST_CambiarEstado_Web,
    POST_CambiarReunion_Web, 
    POST_CompletarReunion_Web } = require('../controllers/web.controllers.js');

const router= Router();
router.post('/tramites',POST_Tramites_Web)
router.get('/', GET_Tramites_Web);
router.get('/tramites/:id', GET_TramitesById_Web);
router.post('/tramites/:id/estado', POST_CambiarEstado_Web);
router.post('/tramites/:id/reunion',POST_CambiarReunion_Web);
router.post('/tramites/:id/completar-reunion',POST_CompletarReunion_Web);

module.exports=router;
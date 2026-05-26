const {Router} = require('express');
const { GET_Tramites_Web, GET_TramitesById_Web, POST_CambiarEstado_Web } = require('../controllers/web.controllers.js');

const router= Router();

router.get('/', GET_Tramites_Web);
router.get('/tramites/:id', GET_TramitesById_Web);
router.post('/tramites/:id/estado', POST_CambiarEstado_Web);

module.exports=router;
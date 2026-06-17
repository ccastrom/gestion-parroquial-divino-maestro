const { Router } = require('express');
const { GET_Tramites_Web, GET_CalendarioTramites_Web } = require('../controllers/web.controllers.js');
const tramitesRoutes = require('./web/tramites.routes.js');
const personasRoutes = require('./web/personas.routes.js');
const fichasRoutes   = require('./web/fichas.routes.js');

const router = Router();

router.get('/', GET_Tramites_Web);
router.get('/calendario', GET_CalendarioTramites_Web);
router.use('/tramites', tramitesRoutes);
router.use('/personas', personasRoutes);
router.use('/fichas',   fichasRoutes);

module.exports = router;

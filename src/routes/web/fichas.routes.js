const { Router } = require('express');
const { GET_FichaFuneral_Web } = require('../../controllers/web.controllers.js');

const router = Router();

router.get('/funeral', GET_FichaFuneral_Web);

module.exports = router;

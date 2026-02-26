
const {Router} = require('express');
const {getPersonas}= require('../controllers/personas.controllers');
const router= Router();

router.get('/',getPersonas);

module.exports = router;
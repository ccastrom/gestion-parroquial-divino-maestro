const express = require('express');
const router = express.Router();
const {getPersonas}= require('../controllers/personas.controllers');

router.get('/',getPersonas);

module.exports = router;
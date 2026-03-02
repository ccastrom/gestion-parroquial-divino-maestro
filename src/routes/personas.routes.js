
const {Router} = require('express');
const 
{   GET_Personas, 
    POST_Personas,
    PUT_Personas,
    DELETE_Personas}= require('../controllers/personas.controllers');
const router= Router();

router.get('/',GET_Personas);
router.post('/',POST_Personas);
router.put('/:id',PUT_Personas);
router.delete('/:id',DELETE_Personas);

module.exports = router;
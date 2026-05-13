const {Router} = require('express');
const 
{ GET_Tramites_Web}= require ('../controllers/web.controllers.js');

const router= Router();

router.get('/',GET_Tramites_Web);


module.exports=router;
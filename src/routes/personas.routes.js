const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
   res.send('Hola desde personas')
})

module.exports = router;
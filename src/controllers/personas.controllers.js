const {request,response} = require ('express');



const getPersonas = (req=request,res=response)=>{
   res.send('Hola desde personas')
};



module.exports = {
   getPersonas
}
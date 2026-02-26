const {response} = require ('express');



const getPersonas = (req,res=response)=>{
   res.send('Hola desde personas')
};



module.exports = {
   getPersonas
}
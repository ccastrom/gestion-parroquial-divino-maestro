const {request,response} = require ('express');
const PersonaService = require('../services/persona.service');



const GET_Personas = async (req=request,res=response)=>{
   try {
       const personas = await PersonaService.getPersonas();
       res.json({
      msg: "get API - personas",
      personas
   });
      
   } catch (error) {
      res.status(500).json({
         msg: "Error al obtener personas",
         error: error.message
      });
   }
  
};

const POST_Personas=(req=request,res=response)=>{

   const {name,edad}= req.body;

   res.json({
      msg: "post API - personas",
      name
   });
}

const PUT_Personas=(req=request,res=response)=>{
   const id= req.params.id;

   res.json({
      msg: "put API - personas",
      id,
   });
}
const DELETE_Personas=(req=request,res=response)=>{
   res.send('Hola desde DELETE personas')
}


module.exports = {
   GET_Personas,
   POST_Personas,
   PUT_Personas,
   DELETE_Personas
}
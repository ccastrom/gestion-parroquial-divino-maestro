const {request,response} = require ('express');
const PersonaService = require('../services/persona.service');
const asyncHandler= require('../utils/asyncHandler')



const GET_Personas = asyncHandler(async(req,res)=>{
  const {nombre, apellido}= req.query;
   const getPersonas= await PersonaService.getPersonas(nombre,apellido);
   return res.status(200).json(getPersonas);
});
  

const POST_Personas=asyncHandler (async(req,res)=>{
    
   const crearPersona= await PersonaService.createPersona(req.body);
  if(crearPersona.advertencia){
   return res.status(200).json(crearPersona);
  }
  res.status(201).json(crearPersona);
});


const PUT_Personas= asyncHandler(async(req,res)=>{

});
  
const DELETE_Personas= asyncHandler(async(req,res)=>{
  
});


module.exports = {
   GET_Personas,
   POST_Personas,
   PUT_Personas,
   DELETE_Personas
}
const {request,response} = require ('express');
const PersonaService = require('../services/persona.service');
const asyncHandler= require('../utils/asyncHandler')



const GET_Personas = asyncHandler(async(req,res)=>{
  const {nombre, apellido}= req.query;
   const getPersonas= await PersonaService.obtenerPersonas(nombre,apellido);
   return res.status(200).json(getPersonas);
});
const GET_PersonaById= asyncHandler(async(req,res)=>{
   const obtenerPersona=await PersonaService.obtenerPersonaPorId(req.params.id);
   return res.status(200).json(obtenerPersona);
})
  

const POST_Personas=asyncHandler (async(req,res)=>{
    
   const crearPersona= await PersonaService.crearPersona(req.body);
  if(crearPersona.advertencia){
   return res.status(200).json(crearPersona);
  }
  res.status(201).json(crearPersona);
});


const PUT_Personas= asyncHandler(async(req,res)=>{
    const persona=req.body
    const actualizarPersona= await PersonaService.actualizarPersonaPorId(req.params.id,persona);
    return res.status(200).json(actualizarPersona);
   

});
  
const DELETE_Personas= asyncHandler(async(req,res)=>{
  
});


module.exports = {
   GET_Personas,
   GET_PersonaById,
   POST_Personas,
   PUT_Personas,
   DELETE_Personas
}
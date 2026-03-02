const {Persona}=require('../models/persona.model');


async function getPersonas(){
    return await Persona.findAll();
}


module.exports={
    getPersonas
}
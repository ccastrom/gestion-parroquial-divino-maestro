const {Persona}=require('../models/persona.model');


async function getPersonas(){
    return await Persona.findAll();
}

const getPersonById=async(id)=>{
    
        const persona= await Persona.findByPk(id);
     if(!persona){
            const error= new Error('Persona no encontrada');
            error.statusCode=404;
            throw error; 
     }
    
     return persona;
    
    }
    


module.exports={
    getPersonas,
    getPersonById
}
const {Persona}=require('../models/persona.model');



const createPersona= async(persona)=>{
    if(persona.rut){
        await getPersonaByRUT(persona.rut);
    }else{
        const resultado=await getPersonaByNombreApellido(persona);
        if(resultado?.advertencia){
            return resultado;
        }
    }
    return await Persona.create(persona);
     
};


const getPersonas=async()=>{
    return await Persona.findAll();
}

const getPersonaByNombreApellido=async(datos)=>{
    const personaExistente=await Persona.findOne({
        where:{
            nombre:datos.nombre,
            apellido: datos.apellido
        }
    });
    if(personaExistente){
        return{
              advertencia: true,
              mensaje:"Persona existe con este nombre",
              personaEncontrada:personaExistente
        }
      
        
    }
}


const getPersonaByRUT=async(rutPersona)=>{
    const personaExistente= await Persona.findOne({
        where:{
            rut:rutPersona
        }
    });
    if(personaExistente){
         const error = new Error("persona duplicada por rut");
        error.statusCode = 400;
        throw error;
    }
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
    createPersona,
    getPersonas,
    getPersonaByRUT,
    getPersonaByNombreApellido,
    getPersonById
}
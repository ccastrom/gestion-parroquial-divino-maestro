const { Tramite, Participacion, Persona } = require('../models');
const {ESTADOS_VALIDOS}= require('../constants/estados_tramites');

const cambiarEstadoTramite=async(id,nuevoEstado)=>{
  if(!Object.values(ESTADOS_VALIDOS).includes(nuevoEstado)){
    throw new Error(`Estado no válido. Estados permitidos: ${Object.values(ESTADOS_VALIDOS).join(', ')}`);
  }

  const tramite=await Tramite.findByPk(id);
  if(!tramite){
    const error= new Error('Trámite no encontrado');
            error.statusCode=404;
            throw error;
    
  }
  tramite.estado=nuevoEstado;
  await tramite.save();
  return tramite;
}

const Test_tramiteParticipacion=async()=>{
  const result= await Participacion.findOne({
    include:Persona
  });

  console.log(result);
  return result;
}

const agregarParticipante=async(id,datos)=>{
    const tramite= await getTramiteById(id);
    return tramite;
   

};






const createTramite=async()=>{
    return await Tramite.create({});
}

const getTramiteById=async(id)=>{
    const tramite= await Tramite.findByPk(id);
     if(!tramite){
            const error= new Error('Trámite no encontrado');
            error.statusCode=404;
            throw error;
    
  }
  return tramite;
}

const getTramites=async()=>{
    return await Tramite.findAll();
}




module.exports={
    createTramite,
    getTramites,
    getTramiteById,
    cambiarEstadoTramite,
    agregarParticipante,
    Test_tramiteParticipacion
    
}
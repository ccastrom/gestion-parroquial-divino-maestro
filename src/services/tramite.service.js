const {Tramite} = require('../models/tramite.model');

const ESTADOS_VALIDOS=[
    'Iniciado',
    'Reunion asignada',
    'Agendado',
    'Finalizado',
    'Derivado',
    'Reabierto'
];

const cambiarEstadoTramite=async(id,nuevoEstado)=>{
  if(!ESTADOS_VALIDOS.includes(nuevoEstado)){
    throw new Error(`Estado no válido. Estados permitidos: ${ESTADOS_VALIDOS.join(', ')}`);
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


const agregarParticipante=async(id,datos)=>{
    const tramite= await getTramiteById(id);
   

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
    agregarParticipante
}
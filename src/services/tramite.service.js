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
    throw new Error('Trámite no encontrado');
  }
  tramite.estado=nuevoEstado;
  await tramite.save();
  return tramite;
}






async function createTramite(){
    return await Tramite.create({});
}

async function getTramiteById(id){
    return await Tramite.findByPk(id);
}

async function getTramites(){
    return await Tramite.findAll();
}



module.exports={
    createTramite,
    getTramites,
    getTramiteById,
    cambiarEstadoTramite
}
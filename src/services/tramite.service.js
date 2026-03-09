const { Tramite, Participacion, Persona } = require('../models');
const {ESTADOS_VALIDOS,validarEstado}= require('../constants/estados_tramites');
const {ROLES_VALIDOS,validateRol}= require('../constants/roles_Participantes');


const cambiarEstadoTramite=async(id,nuevoEstado)=>{
  validarEstado(nuevoEstado);
  const tramite= await validarTramite(id);
  tramite.estado=nuevoEstado;
  await tramite.save();
  return tramite;
}

const Test_tramiteParticipacion=async(id,datos)=>{
   const tramite= await validarTramite(id);
   validateRol(datos.rol);
   return tramite
}

const agregarParticipante=async(id,datos)=>{
    const tramite= await validarTramite(id);
    return tramite;
   

};






const createTramite=async()=>{
    return await Tramite.create({});
}

const validarTramite=async(id)=>{
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
    validarTramite,
    cambiarEstadoTramite,
    agregarParticipante,
    Test_tramiteParticipacion
    
}
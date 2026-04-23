const {Participacion}=require('../models/participacion.model');

const getParticipacionById= async(id)=>{
  const participacion= await Participacion.findByPk(id);
  if(!participacion){
    const error = new Error("Participación no encontrada");
    error.statusCode = 404;
    throw error;
  }
  return participacion;
}


module.exports = {
    getParticipacionById,
    // checkRolUnicoExistente,
    // getParticipantesByTramite,
    // crearParticipacionDB
}
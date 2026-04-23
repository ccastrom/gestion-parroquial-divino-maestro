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

const checkRolUnicoExistente = async (participante) => {
    const bautizadoExistente = await Participacion.findOne({
      where: { id_fk_tramite: participante.tramiteId, rol:participante.rol  },
    });
    if( bautizadoExistente){
        const error = new Error(`Ya existe un participante con el rol ${participante.rol} en este trámite.`);
        error.statusCode = 400;
        throw error;
    }
}



module.exports = {
    getParticipacionById,
    checkRolUnicoExistente,
    // getParticipantesByTramite,
    // crearParticipacionDB
}
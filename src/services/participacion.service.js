const { Participacion, Persona, Documento } = require('../models');

const crearParticipacion = async (participanteData, idPersona, transaction) => {
  await Participacion.create(
    {
      id_fk_tramite: participanteData.tramiteId,
      id_fk_persona: idPersona,
      rol: participanteData.rol,
    },
    { transaction }
  );
};

const obtenerParticipacionPorId = async (id) => {
  const participacion = await Participacion.findByPk(id);
  if (!participacion) {
    const error = new Error("Participación no encontrada");
    error.statusCode = 404;
    throw error;
  }
  return participacion;
};

const obtenerParticipantesPorTramite = async (id) => {
  const participantes = await Participacion.findAll({
    where: { id_fk_tramite: id },
    include: [
      {
        model: Persona,
        attributes: ["nombre", "apellido", "fecha_nacimiento", "rut", "fono", "direccion"],
      },
        {
        model: Documento,
        attributes: ["id", "tipo_documento", "estado_documento", "fecha_entrega"],
        required: false
      }
    ],
    
  });
  return participantes;
};

const verificarRolUnicoExistente = async (participante) => {
  const bautizadoExistente = await Participacion.findOne({
    where: { id_fk_tramite: participante.tramiteId, rol: participante.rol },
  });
  if (bautizadoExistente) {
    const error = new Error(`Ya existe un participante con el rol ${participante.rol} en este trámite.`);
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  obtenerParticipacionPorId,
  verificarRolUnicoExistente,
  obtenerParticipantesPorTramite,
  crearParticipacion,
};

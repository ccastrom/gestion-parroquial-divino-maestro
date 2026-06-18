const sequelize = require('../config/database.js');
const { Op } = require('sequelize');
const { Participacion, Persona, Documento } = require('../models');
const { ROLES_UNICOS, validarRol } = require('../constants/roles_Participantes');

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
  const ListaDeParticipantes = await Participacion.findAll({
    where: { id_fk_tramite: id },
    include: [
      {
        model: Persona,
        attributes: ["id", "nombre", "apellido", "fecha_nacimiento", "rut", "fono", "direccion", "tipo", "observaciones","lugar_nacimiento"],
      },
        {
        model: Documento,
        attributes: ["id", "tipo_documento", "estado_documento", "fecha_entrega"],
        required: false
      }
    ],

  });
  return ListaDeParticipantes;
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

const actualizarRolParticipacion = async ({ idParticipacion, idTramite, nuevoRol }) => {
  const participacion = await obtenerParticipacionPorId(idParticipacion);

  if (String(participacion.id_fk_tramite) !== String(idTramite)) {
    const error = new Error('La participación no pertenece a este trámite.');
    error.statusCode = 403;
    throw error;
  }

  validarRol(nuevoRol);

  if (ROLES_UNICOS.includes(nuevoRol)) {
    const otroConMismoRol = await Participacion.findOne({
      where: { id_fk_tramite: idTramite, rol: nuevoRol, id: { [Op.ne]: idParticipacion } },
    });
    if (otroConMismoRol) {
      const error = new Error(`Ya existe un participante con el rol ${nuevoRol} en este trámite.`);
      error.statusCode = 400;
      throw error;
    }
  }

  return await Participacion.update({ rol: nuevoRol }, { where: { id: idParticipacion } });
};

const eliminarParticipacion = async ({ idParticipacion, idTramite }) => {
  const participacion = await obtenerParticipacionPorId(idParticipacion);

  if (String(participacion.id_fk_tramite) !== String(idTramite)) {
    const error = new Error('La participación no pertenece a este trámite.');
    error.statusCode = 403;
    throw error;
  }

  const transaction = await sequelize.transaction();
  try {
    await Documento.destroy({ where: { id_fk_participacion: idParticipacion }, transaction });
    await participacion.destroy({ transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  obtenerParticipacionPorId,
  verificarRolUnicoExistente,
  obtenerParticipantesPorTramite,
  crearParticipacion,
  actualizarRolParticipacion,
  eliminarParticipacion,
};

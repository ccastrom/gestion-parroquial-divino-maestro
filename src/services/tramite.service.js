const sequelize = require("../config/database.js");
const { Tramite, Participacion, Persona } = require("../models");
const {
  ESTADOS_VALIDOS,
  validarEstado,
} = require("../constants/estados_tramites");
const {
  ROLES_VALIDOS,
  validateRol,
} = require("../constants/roles_Participantes");
const { getPersonById } = require("./persona.service");

const cambiarEstadoTramite = async (id, nuevoEstado) => {
  validarEstado(nuevoEstado);
  const tramite = await getTramiteById(id);
  tramite.estado = nuevoEstado;
  await tramite.save();
  return tramite;
};

const Test_tramiteParticipacion = async (id, datos) => {
  const participanteData = {
    tramiteId: id,
    personaId: datos.personaId,
    persona: datos.persona,
    rol: datos.rol,
  };
  const tramite = await getTramiteById(participanteData.tramiteId);
  validateRol(participanteData.rol);
  if (participanteData.personaId) {
     await getPersonById(participanteData.personaId);
  }

  await crearParticipante(participanteData);
  return await getParticipantesByTramite(participanteData.tramiteId);
};

const agregarParticipante = async (id, datos) => {
  //EN ESPERA
  const tramite = await getTramiteById(id);
  return tramite;
};

const createTramite = async () => {
  return await Tramite.create({});
};

const getTramiteById = async (id) => {
  const tramite = await Tramite.findByPk(id);
  if (!tramite) {
    const error = new Error("Trámite no encontrado");
    error.statusCode = 404;
    throw error;
  }
  return tramite;
};

const getTramites = async () => {
  return await Tramite.findAll();
};

const crearParticipante = async (participanteData) => {

  const transaction = await sequelize.transaction();
  try {
    if (participanteData.personaId) {
      await Participacion.create(
        {
          id_fk_tramite: participanteData.tramiteId,
          id_fk_persona: participanteData.personaId,
          rol: participanteData.rol,
        },
        { transaction },
      );
    } else {
      const { nombre, apellido, fecha_nacimiento, rut, fono, direccion } =
        participanteData.persona;
      const nuevaPersona = await Persona.create(
        {
          nombre,
          apellido,
          fecha_nacimiento,
          rut,
          fono,
          direccion,
        },
        { transaction },
      );

      await Participacion.create(
        {
          id_fk_tramite: participanteData.tramiteId,
          id_fk_persona: nuevaPersona.id,
          rol: participanteData.rol,
        },
        { transaction },
      );
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getParticipantesByTramite = async (id) => {
  const participantes = await Participacion.findAll({
    where: { id_fk_tramite: id },
    include: [
      {
        model: Persona,
        attributes: [
          "nombre",
          "apellido",
          "fecha_nacimiento",
          "rut",
          "fono",
          "direccion",
        ],
      },
    ],
  });
  return participantes;
};

module.exports = {
  createTramite,
  getTramites,
  getTramiteById,
  cambiarEstadoTramite,
  agregarParticipante,
  Test_tramiteParticipacion,
};

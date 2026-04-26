const sequelize = require("../config/database.js");
const { Tramite, Reunion_prebautizmal } = require("../models");
const { ESTADOS_VALIDOS, validarEstado } = require("../constants/estados_tramites");
const { ROLES_VALIDOS, ROLES_UNICOS, validarRol } = require("../constants/roles_Participantes");
const { obtenerPersonaPorId, crearPersona } = require("./persona.service");
const { crearReunionPreBautizo, actualizarReunionPreBautizoPorId, obtenerReunionPreBautizoPorId } = require("./reunion_pre_bautizo.service.js");
const { crearDocumento, obtenerDocumentoParticipacion } = require("./documento.service.js");
const participacionService = require('./participacion.service');

const modificarTramite = async (id, tramiteDatos) => {
  validarEstado(tramiteDatos.estado);
  const tramite = await obtenerTramitePorId(id);
  tramite.estado = tramiteDatos.estado;
  if (tramiteDatos.fecha_bautismo) {
    tramite.fecha_bautismo = tramiteDatos.fecha_bautismo;
  }
  await tramite.save();
  return tramite;
};

const actualizarReunionPorId = async (id, datos) => {
  validarEstado(datos.estado);
  const tramite = await obtenerTramitePorId(id);
  await obtenerPersonaPorId(datos.id_fk_persona_catequista);
  return await actualizarReunionPreBautizoPorId(tramite.id_fk_reunion_pre_bautizo, datos);
};

const agregarParticipante = async (id, datos) => {
  const participanteData = {
    tramiteId: id,
    personaId: datos.personaId,
    persona: datos.persona,
    rol: datos.rol,
  };
  const tramite = await obtenerTramitePorId(participanteData.tramiteId);
  participanteData["tramite"] = tramite.dataValues;
  validarRol(participanteData.rol);
  if (participanteData.personaId) {
    await obtenerPersonaPorId(participanteData.personaId);
  }
  if (ROLES_UNICOS.includes(participanteData.rol)) {
    await participacionService.verificarRolUnicoExistente(participanteData);
  }
  await crearParticipacion(participanteData);
  return await participacionService.obtenerParticipantesPorTramite(participanteData.tramiteId);
};

const crearParticipacion = async (participanteData) => {
  const transaction = await sequelize.transaction();
  try {
    if (participanteData.personaId) {
      await participacionService.crearParticipacion(participanteData, participanteData.personaId, transaction);
    } else {
      const nuevaPersona = await crearPersona(participanteData.persona, transaction);
      await participacionService.crearParticipacion(participanteData, nuevaPersona.id, transaction);
    }
    if (!participanteData.tramite.id_fk_reunion_pre_bautizo) {
      const reunion = await crearReunionPreBautizo(transaction);
      await Tramite.update(
        { id_fk_reunion_pre_bautizo: reunion.id },
        { where: { id: participanteData.tramiteId }, transaction }
      );
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw { status: 409, message: 'Esta persona ya existe en este trámite' };
    }
    throw error;
  }
};

const completarReunion = async (idTramite, estadoReunion) => {
  validarEstado(estadoReunion.estado);
  const tramite = await obtenerTramitePorId(idTramite);
  const reunion = await obtenerReunionPreBautizoPorId(tramite.id_fk_reunion_pre_bautizo);
  const transaction = await sequelize.transaction();
  try {
    await Reunion_prebautizmal.update(
      { estado: estadoReunion.estado },
      { where: { id: reunion.id }, transaction }
    );
    await Tramite.update(
      { estado: ESTADOS_VALIDOS.Reunion_Pre_Bautizo_Completada },
      { where: { id: idTramite }, transaction }
    );
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const agregarDocumentoParticipacion = async (documento) => {
  validarEstado(documento.documento.estado_documento);
  const tramite = await obtenerTramitePorId(documento.idTramite);
  const participacion = await participacionService.obtenerParticipacionPorId(documento.idParticipacion);
  const obtenerDocumento = await obtenerDocumentoParticipacion(documento.idParticipacion);
  const NuevoDocumento = {
    id_fk_participacion: participacion.id,
    tipo_documento: documento.documento.tipo_documento,
    estado_documento: documento.documento.estado_documento,
    fecha_entrega: documento.documento.fecha_entrega,
  };
  if (!obtenerDocumento) {
    return await crearDocumento(NuevoDocumento);
  } else {
    const error = new Error("Documento ya existente en participación");
    error.statusCode = 404;
    throw error;
  }
};

const crearTramite = async () => {
  return await Tramite.create();
};

const obtenerTramitePorId = async (id) => {
  const tramite = await Tramite.findByPk(id);
  if (!tramite) {
    const error = new Error("Trámite no encontrado");
    error.statusCode = 404;
    throw error;
  }
  return tramite;
};

const obtenerTramites = async () => {
  return await Tramite.findAll();
};

module.exports = {
  crearTramite,
  obtenerTramites,
  obtenerTramitePorId,
  modificarTramite,
  actualizarReunionPorId,
  agregarParticipante,
  completarReunion,
  agregarDocumentoParticipacion,
};

const sequelize = require("../config/database.js");
const { Tramite, Reunion_prebautizmal, Participacion, Persona } = require("../models");
const { ESTADOS_VALIDOS, validarEstado } = require("../constants/estados_tramites");
const { ROLES_VALIDOS, ROLES_UNICOS, validarRol } = require("../constants/roles_Participantes");
const { obtenerPersonaPorId, crearPersona } = require("./persona.service");
const { crearReunionPreBautizo, actualizarReunionPreBautizoPorId, obtenerReunionPreBautizoPorId } = require("./reunion_pre_bautizo.service.js");
const { crearDocumento, obtenerDocumentoParticipacion } = require("./documento.service.js");
const participacionService = require('./participacion.service');

const crearTramite = async () => {
  return await Tramite.create();
};

const obtenerTramites = async () => {
  return await Tramite.findAll();
};

const obtenerTramitesConBautizado = async () => {
  return await Tramite.findAll({
    include: [{
      model: Participacion,
      as: 'participacion',
      where: { rol: 'Bautizado' },
      required: false,
      include: [{ model: Persona, attributes: ['nombre', 'apellido'] }]
    }],
    order: [['fecha_ingreso', 'DESC']]
  });
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

const agregarParticipante = async (id, participante) => {
  const tramite = await obtenerTramitePorId(id);
  validarRol(participante.rol);
  if (participante.personaId) {
    await obtenerPersonaPorId(participante.personaId);
  }
  if (ROLES_UNICOS.includes(participante.rol)) {
    await participacionService.verificarRolUnicoExistente({ tramiteId: id, rol: participante.rol });
  }

  const transaction = await sequelize.transaction();
  try {
    const personaId = participante.personaId
      ? participante.personaId
      : (await crearPersona(participante.persona, transaction)).id;

    await participacionService.crearParticipacion({ tramiteId: id, rol: participante.rol }, personaId, transaction);

    if (!tramite.id_fk_reunion_pre_bautizo) {
      const reunion = await crearReunionPreBautizo(transaction);
      await Tramite.update(
        { id_fk_reunion_pre_bautizo: reunion.id },
        { where: { id }, transaction }
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

  return await participacionService.obtenerParticipantesPorTramite(id);
};

const actualizarReunionPorId = async (id, datos) => {
  validarEstado(datos.estado);
  const tramite = await obtenerTramitePorId(id);
  await obtenerPersonaPorId(datos.id_fk_persona_catequista);
  return await actualizarReunionPreBautizoPorId(tramite.id_fk_reunion_pre_bautizo, datos);
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

  return await obtenerTramitePorId(idTramite);
};

const agregarDocumentoParticipacion = async (documento) => {
  validarEstado(documento.documento.estado_documento);
  await obtenerTramitePorId(documento.idTramite);
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
    error.statusCode = 409;
    throw error;
  }
};

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
const obtenerDetalleTramite = async (id) => {
  const tramite = await obtenerTramitePorId(id);
  const participantes = await participacionService.obtenerParticipantesPorTramite(id);
  let reunion = null;
  let catequista = null;
  if (tramite.id_fk_reunion_pre_bautizo) {
    reunion = await obtenerReunionPreBautizoPorId(tramite.id_fk_reunion_pre_bautizo);
    if (reunion.id_fk_persona_catequista) {
      catequista = await obtenerPersonaPorId(reunion.id_fk_persona_catequista);
    }
  }
  const ListaDecatequistas = await Participacion.findAll({
    where: { rol: ROLES_VALIDOS.Catequista },
    include: [{ model: Persona, attributes: ['id', 'nombre', 'apellido'] }],
  });
  return { tramite, participantes, reunion, catequista, ListaDecatequistas };
};
module.exports = {
  crearTramite,
  obtenerTramites,
  obtenerTramitesConBautizado,
  obtenerTramitePorId,
  modificarTramite,
  actualizarReunionPorId,
  agregarParticipante,
  completarReunion,
  agregarDocumentoParticipacion,
  obtenerDetalleTramite,
};

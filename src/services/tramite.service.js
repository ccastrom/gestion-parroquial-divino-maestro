const sequelize = require("../config/database.js");
const { Tramite, Reunion_prebautizmal, Participacion, Persona } = require("../models");
const { ESTADOS_VALIDOS, validarEstado } = require("../constants/estados_tramites");
const { ROLES_VALIDOS, ROLES_UNICOS, validarRol } = require("../constants/roles_Participantes");
const { obtenerPersonaPorId, crearPersona } = require("./persona.service");
const { crearReunionPreBautizo, actualizarReunionPreBautizoPorId, obtenerReunionPreBautizoPorId } = require("./reunion_pre_bautizo.service.js");
const { crearDocumento, obtenerDocumentoParticipacion, obtenerDocumentoPorId, actualizarDocumento } = require("./documento.service.js");
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
  return await actualizarReunionPreBautizoPorId(tramite.id_fk_reunion_pre_bautizo, datos);
};

const completarReunion = async (idTramite) => {
  const tramite = await obtenerTramitePorId(idTramite);
  const reunion = await obtenerReunionPreBautizoPorId(tramite.id_fk_reunion_pre_bautizo);
  if(!reunion.id_fk_persona_catequista || !reunion.fecha){
    const error = new Error("No se puede completar la reunión sin catequista asignado y fecha establecida");
    error.statusCode = 400;
    throw error;
  }
  const transaction = await sequelize.transaction();
  try {
    await Reunion_prebautizmal.update(
      { estado: ESTADOS_VALIDOS.Reunion_Pre_Bautizo_Completada },
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

const agregarDocumentoParticipacion = async ({ idTramite, idParticipacion, documento }) => {
  validarEstado(documento.estado_documento);
  await obtenerTramitePorId(idTramite);
  const participacion = await participacionService.obtenerParticipacionPorId(idParticipacion);
  const documentoExistente = await obtenerDocumentoParticipacion(idParticipacion);
  if (documentoExistente) {
    const error = new Error("Documento ya existente en participación");
    error.statusCode = 409;
    throw error;
  }
  return await crearDocumento({
    id_fk_participacion: participacion.id,
    tipo_documento: documento.tipo_documento,
    estado_documento: documento.estado_documento,
    fecha_entrega: documento.fecha_entrega,
  });
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
const modificarDocumentoParticipacion = async ({ idTramite, idDocumento, documento }) => {
  validarEstado(documento.estado_documento);
  await obtenerTramitePorId(idTramite);
  const documentoEncontrado = await obtenerDocumentoPorId(idDocumento); 
  const documentoParticipanteTramite = await participacionService.obtenerParticipacionPorId(documentoEncontrado.id_fk_participacion);
  if (String(documentoParticipanteTramite.id_fk_tramite) !== String(idTramite)) {
    const error = new Error('El documento no pertenece a este trámite');
    error.statusCode = 403;
    throw error;
  }
  return await actualizarDocumento(idDocumento, documento); 
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
  modificarDocumentoParticipacion
};

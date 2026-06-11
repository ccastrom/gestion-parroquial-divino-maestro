const sequelize = require("../config/database.js");
const { Op } = require('sequelize');
const { Tramite, Reunion_prebautizmal, Participacion, Persona } = require("../models");
const { ESTADOS_VALIDOS, validarEstadoTramite, validarEstadoReunion, validarEstadoDocumento } = require("../constants/estados_tramites");
const { ROLES_VALIDOS, ROLES_UNICOS, validarRol } = require("../constants/roles_Participantes");
const { obtenerPersonaPorId, crearPersona } = require("./persona.service");
const { crearReunionPreBautizo, actualizarReunionPreBautizoPorId, obtenerReunionPreBautizoPorId } = require("./reunion_pre_bautizo.service.js");
const { crearDocumento, obtenerDocumentoParticipacion, obtenerDocumentoPorId, actualizarDocumento } = require("./documento.service.js");
const participacionService = require('./participacion.service');

const validarFechaNoPasada = (fecha) => {
  const hoy = new Date().toISOString().split('T')[0];
  const fechaStr = new Date(fecha).toISOString().split('T')[0];
  if (fechaStr < hoy) {
    const err = new Error('La fecha de bautismo no puede ser anterior a hoy');
    err.statusCode = 400;
    throw err;
  }
};

const crearTramite = async (datos = {}) => {
  if (datos.fecha_bautismo) validarFechaNoPasada(datos.fecha_bautismo);
  return await Tramite.create(datos);
};

const obtenerTramites = async () => {
  return await Tramite.findAll();
};

const obtenerTramitesConBautizado = async () => {
  return await Tramite.findAll({
    where: { fecha_eliminacion: null, es_historico: false },
    include: [{
      model: Participacion,
      as: 'participacion',
      where: { rol: 'Bautizado' },
      required: false,
      include: [{ model: Persona, attributes: ['id', 'nombre', 'apellido'] }]
    }],
    order: [['fecha_ingreso', 'DESC']]
  });
};

const obtenerTramitesEliminados = async () => {
  return await Tramite.findAll({
    where: { fecha_eliminacion: { [Op.ne]: null }, es_historico: false },
    include: [{
      model: Participacion,
      as: 'participacion',
      where: { rol: 'Bautizado' },
      required: false,
      include: [{ model: Persona, attributes: ['id', 'nombre', 'apellido'] }]
    }],
    order: [['fecha_eliminacion', 'DESC']]
  });
};
const obtenerTramitesParaCalendario = async () => {
  return await Tramite.findAll({
    where: { fecha_eliminacion: null, es_historico: false },
    attributes: ['id', 'fecha_bautismo', 'estado', 'fecha_ingreso'],
    include: [{
      model: Participacion,
      as: 'participacion',
      where: { rol: 'Bautizado' },
      required: false,
      include: [{ model: Persona, attributes: ['nombre', 'apellido'] }]
    }],
    order: [['fecha_bautismo', 'ASC']]
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

const eliminarTramite = async (id) => {
  const tramite = await obtenerTramitePorId(id);
  tramite.fecha_eliminacion = new Date();
  await tramite.save();
};

const restaurarTramite = async (id) => {
  const tramite = await obtenerTramitePorId(id);
  tramite.fecha_eliminacion = null;
  await tramite.save();
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

  if (participante.rol === ROLES_VALIDOS.Bautizado && participante.personaId) {
    const bautizadoPrevio = await Participacion.findOne({
      where: { id_fk_persona: participante.personaId, rol: ROLES_VALIDOS.Bautizado },
    });
    if (bautizadoPrevio) {
      const error = new Error('Esta persona ya está registrada como Bautizado en otro trámite');
      error.statusCode = 409;
      throw error;
    }
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
  validarEstadoReunion(datos.estado);
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
  validarEstadoDocumento(documento.estado_documento);
  await obtenerTramitePorId(idTramite);
  const participacion = await participacionService.obtenerParticipacionPorId(idParticipacion);
  const documentoParticipanteExistente = await obtenerDocumentoParticipacion(idParticipacion);
  if (documentoParticipanteExistente) {
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
  validarEstadoTramite(tramiteDatos.estado);
  const tramite = await obtenerTramitePorId(id);
  tramite.estado = tramiteDatos.estado;
  if (tramiteDatos.fecha_bautismo) {
    validarFechaNoPasada(tramiteDatos.fecha_bautismo);
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
  const ListaDecatequistas = await Persona.findAll({
    where: { tipo: 'catequista' },
    attributes: ['id', 'nombre', 'apellido'],
    order: [['apellido', 'ASC']],
  });
  const ListaDePersonas = await Persona.findAll({
    where: { tipo: null },
    attributes: ['id', 'nombre', 'apellido'],
    order: [['apellido', 'ASC']],
  });
  const ListaDeCelebrantes = await Persona.findAll({
    where: { tipo: 'celebrante' },
    attributes: ['id', 'nombre', 'apellido'],
    order: [['apellido', 'ASC']],
  });

  return { tramite, participantes, reunion, catequista, ListaDecatequistas, ListaDePersonas, ListaDeCelebrantes };
};
const modificarDocumentoParticipacion = async ({ idTramite, idDocumento, documento }) => {
  validarEstadoDocumento(documento.estado_documento);
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
const registrarBautismoHistorico = async (datos) => {
  const {
    bautizado_nombre, bautizado_apellido, bautizado_rut,
    bautizado_fecha_nacimiento, bautizado_lugar_nacimiento, bautizado_direccion,
    padre_nombre, padre_apellido,
    madre_nombre, madre_apellido,
    padrino_nombre, padrino_apellido,
  } = datos;

  // El formulario puede enviar uno (string) o varios (array) padrinos según cuántas filas haya
  const asegurarArray = (valor) => !valor ? [] : Array.isArray(valor) ? valor : [valor];
  const listaNombresPadrinos   = asegurarArray(padrino_nombre);
  const listaApellidosPadrinos = asegurarArray(padrino_apellido);

  const padrinosComoParticipantes = listaNombresPadrinos.map((nombre, indice) => ({
    rol: 'Padrino',
    nombre,
    apellido: listaApellidosPadrinos[indice] || null,
  }));

  const candidatos = [
    { rol: 'Bautizado', nombre: bautizado_nombre, apellido: bautizado_apellido, rut: bautizado_rut, fecha_nacimiento: bautizado_fecha_nacimiento, lugar_nacimiento: bautizado_lugar_nacimiento, direccion: bautizado_direccion },
    { rol: 'Padre',  nombre: padre_nombre,  apellido: padre_apellido },
    { rol: 'Madre',  nombre: madre_nombre,  apellido: madre_apellido },
    ...padrinosComoParticipantes,
  ].filter(p => p.nombre && p.apellido);

  const transaction = await sequelize.transaction();
  try {
    const tramite = await Tramite.create({
      estado: ESTADOS_VALIDOS.Bautizo_Finalizado_Con_Éxito,
      es_historico: true,
    }, { transaction });

    for (const { rol, ...datoPersona } of candidatos) {
      const persona = await Persona.create({ ...datoPersona, tipo: 'historico' }, { transaction });
      await Participacion.create({
        id_fk_tramite: tramite.id,
        id_fk_persona: persona.id,
        rol,
      }, { transaction });
    }

    await transaction.commit();
    return tramite;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const obtenerTramitesHistoricos = async () => {
  return await Tramite.findAll({
    where: { es_historico: true, fecha_eliminacion: null },
    include: [{
      model: Participacion,
      as: 'participacion',
      where: { rol: 'Bautizado' },
      required: false,
      include: [{ model: Persona, attributes: ['nombre', 'apellido'] }]
    }],
    order: [['id', 'DESC']]
  });
};

module.exports = {
  crearTramite,
  obtenerTramites,
  obtenerTramitesConBautizado,
  obtenerTramitesEliminados,
  obtenerTramitePorId,
  modificarTramite,
  actualizarReunionPorId,
  agregarParticipante,
  completarReunion,
  agregarDocumentoParticipacion,
  obtenerDetalleTramite,
  modificarDocumentoParticipacion,
  obtenerTramitesParaCalendario,
  eliminarTramite,
  restaurarTramite,
  registrarBautismoHistorico,
  obtenerTramitesHistoricos,
};

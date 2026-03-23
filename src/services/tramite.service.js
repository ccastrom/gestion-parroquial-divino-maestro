const sequelize = require("../config/database.js");
const { Tramite, Participacion, Persona, Reunion_prebautizmal } = require("../models");
const {ESTADOS_VALIDOS, validarEstado, } = require("../constants/estados_tramites");
const { ROLES_VALIDOS, ROLES_UNICOS,  validateRol, } = require("../constants/roles_Participantes");
const { getPersonById } = require("./persona.service");
const {createReunionPreBautizo,updateReunionPreBautizoByID,getReunionPreBautizoById}= require("./reunion_pre_bautizo.service.js");

const cambiarEstadoTramite = async (id, nuevoEstado) => {
  validarEstado(nuevoEstado);
  const tramite = await getTramiteById(id);
  tramite.estado = nuevoEstado;
  await tramite.save();
  return tramite;
};
const actualizarReunionById= async(id,datos)=>{
  validarEstado(datos.estado);
  const tramite=await getTramiteById(id);
   await getPersonById(datos.id_fk_persona_catequista)
  return await  updateReunionPreBautizoByID(tramite.id_fk_reunion_pre_bautizo,datos);
}

const agregarParticipantes = async (id, datos) => {
  const participanteData = {
    tramiteId: id,
    personaId: datos.personaId,
    persona: datos.persona,
    rol: datos.rol,
  };
  const tramite=await getTramiteById(participanteData.tramiteId);
  participanteData["tramite"]=tramite.dataValues;
  validateRol(participanteData.rol);
  if (participanteData.personaId) {
     await getPersonById(participanteData.personaId);
  }
  if( ROLES_UNICOS.includes(participanteData.rol)){
     await checkRolUnicoExistente(participanteData);
  }
  await crearParticipante(participanteData);
  return await getParticipantesByTramite(participanteData.tramiteId);
  
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

    if(!participanteData.tramite.id_fk_reunion_pre_bautizo){
      const reunion = await createReunionPreBautizo({
        transaction
      });
      await Tramite.update({
        id_fk_reunion_pre_bautizo:reunion.id
      },{
        where:{id: participanteData.tramiteId},
        transaction
      })
     
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

   if (error.name === 'SequelizeUniqueConstraintError') {
        throw { status: 400, message: 'Esta persona ya existe en este trámite' };
    }
    
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

const completarReunion= async(idTramite,estadoReunion)=>{
  validarEstado(estadoReunion.estado);
  const tramite=await getTramiteById(idTramite);
  const reunion=await getReunionPreBautizoById(tramite.id_fk_reunion_pre_bautizo);
  console.log( "id Tramite: "+tramite.id+" Reunion: "+reunion.id);
   const transaction = await sequelize.transaction();
   try {
    await Reunion_prebautizmal.update({
      estado:estadoReunion.estado
    },{where:{id:reunion.id},transaction})
    await Tramite.update({
      estado: ESTADOS_VALIDOS.Reunion_Pre_Bautizo_Completada,
    },{where: {id:idTramite},transaction})
     await transaction.commit();
    
   } catch (error) {
     await transaction.rollback();
    throw error;
   }

}


const createTramite = async () => {
  return await Tramite.create();
  
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

module.exports = {
  createTramite,
  getTramites,
  getTramiteById,
  cambiarEstadoTramite,
  actualizarReunionById,
  agregarParticipantes,
  completarReunion
  
};

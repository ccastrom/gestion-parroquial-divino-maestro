const sequelize = require('../config/database.js');
const { Tramite, Participacion, Persona } = require('../models');
const {ESTADOS_VALIDOS,validarEstado}= require('../constants/estados_tramites');
const {ROLES_VALIDOS,validateRol}= require('../constants/roles_Participantes');
const {getPersonById}=require('./persona.service');


const cambiarEstadoTramite=async(id,nuevoEstado)=>{
  validarEstado(nuevoEstado);
  const tramite= await getTramiteById(id);
  tramite.estado=nuevoEstado;
  await tramite.save();
  return tramite;
}

const Test_tramiteParticipacion=async(id,datos)=>{
   const tramite= await getTramiteById(id);
   validateRol(datos.rol);
   if(datos.personaId){
     const persona= await getPersonById(datos.personaId);
   }
    await crearParticipante(id,datos);
   return  tramite;
  
};

const agregarParticipante=async(id,datos)=>{

    //EN ESPERA
    const tramite= await getTramiteById(id);
    return tramite;
   

};

const createTramite=async()=>{
    return await Tramite.create({});
}

const getTramiteById=async(id)=>{
    const tramite= await Tramite.findByPk(id);
     if(!tramite){
            const error= new Error('Trámite no encontrado');
            error.statusCode=404;
            throw error;
    
  }
  return tramite;
}

const getTramites=async()=>{
    return await Tramite.findAll();
}

const crearParticipante = async(id, datos) => {
    console.log('crearParticipante alcanzado', id, datos);
    const transaction = await sequelize.transaction();
    try {
        if(datos.personaId){
           await Participacion.create({
                id_fk_tramite: id,
                id_fk_persona: datos.personaId,
                rol: datos.rol
            }, { transaction });
        } else {
           const nuevaPersona = await Persona.create({
                nombre: datos.persona.nombre,
                apellido: datos.persona.apellido,
                fecha_nacimiento: datos.persona.fecha_nacimiento,
                rut: datos.persona.rut,
                fono: datos.persona.fono,
                direccion: datos.persona.direccion
            }, { transaction });

            await Participacion.create({
                id_fk_tramite: id,
                id_fk_persona: nuevaPersona.id,
                rol: datos.rol
            }, { transaction });
        }
        await transaction.commit();
    } catch (error) {
         console.log("Error en catch: ", error);
        await transaction.rollback();
        throw error;
        
    }
};




module.exports={
    createTramite,
    getTramites,
    getTramiteById,
    cambiarEstadoTramite,
    agregarParticipante,
    Test_tramiteParticipacion
    
}
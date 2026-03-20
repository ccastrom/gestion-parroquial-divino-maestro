const sequelize = require("../config/database.js");
const { Reunion_prebautizmal } = require("../models");
const {ESTADOS_VALIDOS, validarEstado, } = require("../constants/estados_tramites");


const createReunionPreBautizo = async (estadoReunion) => {
    const reunion = await Reunion_prebautizmal.create({
        estado: ESTADOS_VALIDOS.Reunion_Pre_Bautizo_Asignada
    });
    return reunion;
};

const getReunionPreBautizoById = async (id) => {
    const reunion = await Reunion_prebautizmal.findByPk(id);
    if (!reunion) {
        const error = new Error("Reunión de pre-bautizo no encontrada");
        error.statusCode = 404;
        throw error;
        };
    return reunion;
};


const updateReunionPreBautizoByID = async (id, datos) => {
    const reunion = await getReunionPreBautizoById(id);
    if (!reunion) {
        throw new Error("Reunión de pre-bautizo no encontrada");
    }
    return await Reunion_prebautizmal.update(datos,{where:{id:reunion.id}});
};


module.exports = {
    createReunionPreBautizo,
    getReunionPreBautizoById,
    updateReunionPreBautizoByID
}
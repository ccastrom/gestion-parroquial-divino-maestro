const sequelize = require("../config/database.js");
const { Reunion_prebautizmal } = require("../models");
const {ESTADOS_VALIDOS, validarEstado, } = require("../constants/estados_tramites");


const createReunionPreBautizo = async (transaction) => {
    const reunion = await Reunion_prebautizmal.create({
        fecha:null,
        id_fk_persona:null,
        estado:"Reunion Pre bautizo asignada"
    },{transaction});
    return reunion;
};

const getReunionPreBautizoById = async (id_tramite) => {
    const reunion = await Reunion_prebautizmal.findByPk(id_tramite);
    if (!reunion) {
        const error = new Error("Reunión de pre-bautizo no encontrada");
        error.statusCode = 404;
        throw error;
        };
    return reunion;
};


const updateReunionPreBautizo = async (id_tramite, datos) => {
    const reunion = await getReunionPreBautizoById(id_tramite);
    if (!reunion) {
        throw new Error("Reunión de pre-bautizo no encontrada");
    }
    await reunion.update(datos);
    return reunion;
};


module.exports = {
    createReunionPreBautizo,
    getReunionPreBautizoById,
    updateReunionPreBautizo
}
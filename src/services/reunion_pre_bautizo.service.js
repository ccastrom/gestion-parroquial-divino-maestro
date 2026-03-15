const sequelize = require("../config/database.js");
const { ReunionPreBautizo } = require("../models");
const {ESTADOS_VALIDOS, validarEstado, } = require("../constants/estados_tramites");


const createReunionPreBautizo = async () => {
    const reunion = await ReunionPreBautizo.create();
    return reunion;
};

const getReunionPreBautizoById = async (id_tramite) => {
    const reunion = await ReunionPreBautizo.findByPk(id_tramite);
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

const sequelize = require('../config/database.js');
const {Persona} = require('./persona.model');
const {Tramite} = require('./tramite.model');
const {Participacion} = require('./participacion.model');

Participacion.belongsTo(Persona, {
  foreignKey: "id_fk_persona"
});

Persona.hasMany(Participacion,{
    foreignKey:"id_fk_persona"
})

Participacion.belongsTo(Tramite, {
  foreignKey: "id_fk_tramite"
});
Tramite.hasMany(Participacion,{
    foreignKey:"id_fk_tramite"
});
module.exports = { Persona, Tramite, Participacion };
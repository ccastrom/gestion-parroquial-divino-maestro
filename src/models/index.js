
const sequelize = require('../config/database.js');
const {Persona} = require('./persona.model');
const {Tramite} = require('./tramite.model');
const {Participacion} = require('./participacion.model');
const {Reunion_prebautizmal} = require('./reunion_pre_bautizo.model.js');

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

Tramite.belongsTo(Reunion_prebautizmal, {
  foreignKey: "id_fk_reunion_pre_bautizo"
});
Reunion_prebautizmal.hasOne(Tramite, {
  foreignKey: "id_fk_reunion_pre_bautizo"
});

module.exports = { Persona, Tramite, Participacion, Reunion_prebautizmal };
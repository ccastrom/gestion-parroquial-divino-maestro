const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Reunion_prebautizmal= sequelize.define('reunion_prebaustizmal',{
    id:{
        type:DataTypes.INTEGER,
            primaryKey: true,
        autoIncrement: true
    },
    fecha:{
        type:DataTypes.DATE,
    },
    id_fk_persona_catequista:{
        type:DataTypes.INTEGER,
    },
    estado:{
        type:DataTypes.STRING,
    }
},
{
  tableName: "reunion_prebaustizmal", 
  timestamps: false
});

module.exports = {Reunion_prebautizmal};
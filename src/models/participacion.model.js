const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');


const Participacion= sequelize.define('Participacion',{
    id:{
        type:DataTypes.INTEGER,
         primaryKey: true,
        autoIncrement: true
    },
    id_fk_persona:{
        type:DataTypes.INTEGER,
    },
    id_fk_tramite:{
        type:DataTypes.INTEGER,
    },
    rol:{
        type:DataTypes.STRING,
    }

    },
{
  tableName: 'participacion', 
  timestamps: false
});

module.exports = {Participacion};

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const ReunionPreBautizo= sequelize.define('ReunionPreBautizo',{
    id:{
        type:DataTypes.INTEGER,
            primaryKey: true,
        autoIncrement: true
    },
    fecha:{
        type:DataTypes.DATE,
    },
    id_fk_catequista:{
        type:DataTypes.INTEGER,
    }
},
{
  tableName: 'reunion_pre_bautizo', 
  timestamps: false
});

module.exports = {ReunionPreBautizo};
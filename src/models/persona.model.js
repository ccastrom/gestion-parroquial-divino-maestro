const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');


const Persona= sequelize.define('Persona',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:{
        type:DataTypes.STRING,

    },
    apellido:{
        type:DataTypes.STRING,
    },
    fecha_nacimiento:{
        type:DataTypes.DATE,
    },
    rut:{
        type:DataTypes.STRING,
    
    },
    fono:{
        type:DataTypes.STRING,
    },
    direccion:{
        type:DataTypes.STRING,
    },
    tipo:{
        type:DataTypes.STRING,
        allowNull: true,
    },
    observaciones:{
        type:DataTypes.TEXT,
        allowNull: true,
    },
    lugar_nacimiento:{
        type:DataTypes.TEXT,
        allowNull:true
    }
},

{
  tableName: 'persona', 
  timestamps: false

})

module.exports = {Persona};
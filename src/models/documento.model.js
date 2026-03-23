const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Documento= sequelize.define('documento',{
     id:{
        type:DataTypes.INTEGER,
         primaryKey: true,
        autoIncrement: true
    },
    tipo_documento:{
        type:DataTypes.STRING
    },
    estado_documento:{
        type:DataTypes.STRING
    },
    fecha_entrega:{
        type:DataTypes.DATE
    },
    id_fk_participacion:{
        type:DataTypes.DATE
    }
},
{
  tableName: "documento", 
  timestamps: false
});


module.exports={
    Documento
}
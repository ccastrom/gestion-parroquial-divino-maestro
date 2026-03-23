const { Sequelize, Model, DataTypes, INTEGER } = require('sequelize');
const sequelize = require('../config/database.js');

const Documento= Sequelize.deefine('documento',{
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
})


module.exports={
    Documento
}
const { Sequelize, Model, DataTypes, TableHints } = require("sequelize");
const sequelize = require("../config/database.js");




const Tramite = sequelize.define(
  "Tramite",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
    },
    estado: {
      type: DataTypes.STRING,
    },
    fecha_bautismo:{
        type: DataTypes.DATE,
    },
    fecha_eliminacion: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
    es_historico: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    id_fk_reunion_pre_bautizo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "tramite",
    timestamps: false,
  },
);

module.exports = {Tramite};

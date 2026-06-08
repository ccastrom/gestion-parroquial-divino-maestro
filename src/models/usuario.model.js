const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING,
    },
    debe_cambiar_password: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
},
{
    tableName: 'usuario',
    timestamps: false
})

module.exports = { Usuario };

const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');

const verificarCredenciales = async (username, password) => {
  const usuario = await Usuario.findOne({ where: { username } });
  if (!usuario) {
    const error = new Error('Usuario o contraseña incorrectos.');
    error.statusCode = 401;
    throw error;
  }

  const coincide = await bcrypt.compare(password, usuario.password_hash);
  if (!coincide) {
    const error = new Error('Usuario o contraseña incorrectos.');
    error.statusCode = 401;
    throw error;
  }

  return usuario;
};

const cambiarPassword = async ({ idUsuario, passwordActual, passwordNueva }) => {
  const usuario = await Usuario.findByPk(idUsuario);
  if (!usuario) {
    const error = new Error('Usuario no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  const coincide = await bcrypt.compare(passwordActual, usuario.password_hash);
  if (!coincide) {
    const error = new Error('La contraseña actual no es correcta.');
    error.statusCode = 400;
    throw error;
  }

  usuario.password_hash = await bcrypt.hash(passwordNueva, 10);
  usuario.debe_cambiar_password = false;
  await usuario.save();

  return usuario;
};

module.exports = {
  verificarCredenciales,
  cambiarPassword,
};

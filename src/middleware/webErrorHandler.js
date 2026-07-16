const webErrorHandler = (err, req, res, next) => {
  const referer = req.headers.referer || '/web';
  const baseUrl = referer.split('?')[0];

  // err.statusCode solo lo setean a mano los servicios para errores de negocio
  // (mensaje en español, pensado para mostrarse). Sin statusCode, el error viene
  // de una capa inesperada (mysql2, Sequelize, etc.) y su mensaje no es apto para pantalla.
  const mensaje = err.statusCode
    ? err.message
    : 'Ocurrió un error técnico. Si el problema persiste, contactar al administrador.';

  if (!err.statusCode) {
    console.error('[webErrorHandler] Error inesperado:', err);
  }

  // Error de nombre duplicado — modal específico con pre-llenado del Tab 2
  if (err.advertencia && err.personaEncontrada) {
    const { nombre, apellido } = err.personaEncontrada;
    const rol = err.rol || '';
    return res.redirect(
      `${baseUrl}?error_tipo=nombre_duplicado&nombre=${encodeURIComponent(nombre)}&apellido=${encodeURIComponent(apellido)}&rol=${encodeURIComponent(rol)}`
    );
  }

  res.redirect(`${baseUrl}?error=${encodeURIComponent(mensaje)}`);
};

module.exports = webErrorHandler;

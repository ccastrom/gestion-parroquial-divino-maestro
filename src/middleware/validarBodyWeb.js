const validarBodyWeb = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const mensaje = error.details.map(d => d.message).join(', ');
        const base = (req.headers.referer || '/web').split('?')[0];
        return res.redirect(`${base}?error=${encodeURIComponent(mensaje)}`);
    }
    req.body = value;
    next();
};

module.exports = { validarBodyWeb };

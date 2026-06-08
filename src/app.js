
const path = require('path');
const express= require('express');
const session = require('express-session');
const app= express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const personasRoutes= require('./routes/personas.routes');
const tramitesRoutes= require('./routes/tramites.routes');
const webRoutes= require('./routes/web.routes');
const authRoutes= require('./routes/auth.routes');
const errorHandler=require('./middleware/errorHandler');
const webErrorHandler=require('./middleware/webErrorHandler');
const { requireAuth } = require('./middleware/requireAuth');




app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }
}));

app.use('/', authRoutes);
app.use('/web', requireAuth, webRoutes);
app.use(webErrorHandler);
app.use('/personas',personasRoutes);
app.use('/tramites',tramitesRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler);
module.exports=app;


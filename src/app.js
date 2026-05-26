
const path = require('path');
const express= require('express');
const app= express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const personasRoutes= require('./routes/personas.routes');
const tramitesRoutes= require('./routes/tramites.routes');
const webRoutes= require('./routes/web.routes');
const errorHandler=require('./middleware/errorHandler');




app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/web',webRoutes);
app.use('/personas',personasRoutes);
app.use('/tramites',tramitesRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler);
module.exports=app;


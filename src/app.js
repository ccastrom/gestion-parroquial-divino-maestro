
const express= require('express');
const app= express();
const personasRoutes= require('./routes/personas.routes');
const tramitesRoutes= require('./routes/tramites.routes');


app.use(express.json());
app.use('/personas',personasRoutes);
app.use('/tramites',tramitesRoutes);

module.exports=app;


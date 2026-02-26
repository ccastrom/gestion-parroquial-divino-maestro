
const express= require('express');
const app= express();
const personasRoutes= require('./routes/personas.routes');



app.use('/personas',personasRoutes);

module.exports=app;


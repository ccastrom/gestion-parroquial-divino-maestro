require('dotenv').config()

const port = process.env.PORT;
const db_name= process.env.DB_NAME;
const app = require('./app');
const sequelize = require('./config/database');



const server= app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

sequelize.authenticate()
    .then(() => console.log(`Conexión exitosa a la base de datos: ${db_name}`))
    .catch(err => console.error('Error de conexión:', err));
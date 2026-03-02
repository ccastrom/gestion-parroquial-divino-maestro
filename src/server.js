require('dotenv').config()

const port = process.env.PORT;
const app = require('./app');
const sequelize = require('./config/database');



const server= app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

sequelize.authenticate()
    .then(() => console.log('Conexión exitosa a la base de datos'))
    .catch(err => console.error('Error de conexión:', err));
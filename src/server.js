require('dotenv').config()

const port = process.env.PORT;
 const app = require('./app');


const server= app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
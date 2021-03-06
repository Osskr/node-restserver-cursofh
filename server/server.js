require('./config/config')
const express = require('express')
const mongoose = require('mongoose');

const app = express()
const bodyParser = require('body-parser')
 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


app.use(require('./routes/usuario'))

app.get('/', (req, res) => {
    res.json('Hello World')
})



// Conexion a la base de datos
mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true}, (err, res)=>{
    if (err) throw err;
    console.log('Base de datos online')
});

app.listen(process.env.PORT, () => {

    console.log('escuchando en puerto: ', process.env.PORT)
})
const express = require('express')
const Usuario = require('../models/usuario')

const app = express()

const bcrypt = require('bcrypt')

const _ = require('underscore') /*es una libreria que extiende funcionalidades de js para prog funcional*/

app.get('/usuario', (req, res) => {
   
    const desde = Number(req.query.desde) || 0
    const limite = Number(req.query.limite) || 5


    //find recupera los usuarios de forma paginada gracias a .limit y skip(),  exec ejecuta algo
    Usuario.find({estado:true}, 'nombre email').skip(desde)
                    .limit(limite)
                    .exec((err,usuarios)=>{

                        if(err) {
                            return res.status(400).json({
                            ok:false,
                            err
                        })
                    }
                     //devuelve la cantidad de usuarios en la tabla
                    Usuario.countDocuments({estado:true}, (err,conteo)=>{
                        res.json({
                            ok:true,
                            usuarios,
                            conteo
                        })
                    })
                   

                })   

    })


app.post('/usuario', (req, res) => {
    //obtenemos la informacion que nos envian via POST
    const body = req.body

    //creamos un usuario
    const usuario = new Usuario({
        nombre:body.nombre,
        email:body.email,
        password: bcrypt.hashSync(body.password, 10),
        role:body.role
    
    })

    usuario.save((err, usuarioDB)=>{
        if(err) {
             return res.status(400).json({
                ok:false,
                err
            })
        }
        
        //esto es para que no retorne informacion del password 
        //usuarioDB.password=null
        res.json({
            ok:true,
            usuario:usuarioDB
        })
    })

})

app.put('/usuario/:id', (req, res) => {
    
    const id = req.params.id
    const body = _.pick(req.body, ['nombre','email','imagen','role','estado'])
  
   /* el metodo pick() que proviene de la libreria underscore nos permite seleccionar las propiedades que queramos de
   un objeto y nos devuelve una nueva copia solo con esos elementos, esto es ideal ya que no queremos que se pueda
   enviar alguna peticion para cambiar campos como la contraseña, la validacion por google, etc */ 
   /*https://underscorejs.org/#pick*/
   
   //buscamos el usuario que queremos actualizar  en la bd, new:true devuelve el nuevo objeto
   //runValidators: corre las validaciones de nuestro esquema
    Usuario.findByIdAndUpdate(id,body, {new:true, runValidators:true, context: 'query'}, (err, usuarioDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        return res.json({
            ok:true,
            cambiado:"ok",
            usuario:usuarioDB
        })
    })

   
})

app.delete('/usuario/:id', (req, res) => {
   
    const id= req.params.id
    //Eliminacion Fisica   Usuario.findByIdAndRemove(id,(err, usuarioBorrado) =>{
   //Eliminacion Logica

   const cambiaEstado = {
       estado:false
   }
    Usuario.findByIdAndUpdate(id,cambiaEstado,{new:true}, (err, usuarioBorrado) =>{
        
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        if (!usuarioBorrado){
            return res.status(400).json({
                    ok:false,
                    err:{
                        msg:'Usuario No Encontrado'
                    }
            })
        }
            return res.json({
                ok:true,
                usuario:usuarioBorrado
            })
        })

        


})

module.exports = app;
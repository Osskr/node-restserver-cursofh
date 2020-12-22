//modelo de datos del usuario
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const rolesValidos = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol valido perri'
}
const usuarioSchema = new Schema({
    nombre:{
        type:String,
        required:[true, 'El nombre es necesario']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'El correo es necesario']
    },
    password:{
        type:String,
        required:[true,'La contraseña es obligatoria']
    },
    img:{
        type:String,
        required:false
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum:rolesValidos
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
})
//No usar un arrow function porque necesitamos this
//esto es para ocultar la info del password cuando enviamos el post
usuarioSchema.methods.toJSON = function (){
 const user = this;
 const userObject = user.toObject()
 delete userObject.password
 
 //console.log(userObject)
 return userObject;
}
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'})
module.exports = mongoose.model('Usuario', usuarioSchema)
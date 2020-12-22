// Aca vamos a declarar constantes y variables de forma global


//=========================================================//
// Puerto//

process.env.PORT = process.env.PORT || 3000


// Entorno //
//========//

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//=============================
// Base de datos 
//=============================

let urlDB;

if(process.env.NODE_ENV ==='dev'){

    urlDB = 'mongodb://localhost:27017/cafe'
}else{

    urlDB ='mongodb+srv://okr-god:gtr093@cluster0.01usj.mongodb.net/cafe'

}

process.env.URLDB = urlDB

console.log(urlDB)
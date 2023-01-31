var mysql = require('mysql')
var connection=mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"",
    database:"expresscrud"
})
connection.connect(function(err){
    if(!!err)
    {
console.log("Error")
    }
    else{
        console.log("Connected!")
    }
})
module.exports=connection;
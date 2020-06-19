const express = require ('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const placesRoutes = require('./routes/places-routes');

const app = express();

app.use('/api/places',placesRoutes);

// mysql server config
var mysqlConnection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'password',
    database : 'Office',
    multipleStatements: true
});
mysqlConnection.connect((err)=>{
    if (!err) {
        console.log('connected');
    } else {
        console.log(err);
    }

})

app.listen(5000);
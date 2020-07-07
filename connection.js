// mysql server config
const mysql = require('mysql');
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'businessPlanner',
    multipleStatements: true
});
mysqlConnection.connect((err) => {
    if (!err) {
        console.log('connected');
    } else {
        console.log(err);
    }

});

module.exports = mysqlConnection;
const express = require('express');
const router = express.Router();

const mysqlConnection = require('../connection')

router.get('/employee', (req, res,next) => {
    mysqlConnection.query('SELECT * from clients', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

module.exports = router;
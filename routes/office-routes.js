const express = require('express');
const router = express.Router();

const mysqlConnection = require('../connection');
const { checkToken } = require('./auth/token-validation');

// Transfer debit balance
router.post('/debit/:id', checkToken, (req, res, next) => {
    let emp = req.body;
    const tTime = new Date();

    

    mysqlConnection.query('INSERT INTO debitTable (pId,ammount,tTime,note, type) VALUES (?,?,?,?,?)', [req.params.id, emp.ammount, tTime, emp.note,"ofc"], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

// Transfer credit balance
router.post('/credit/:id', checkToken, (req, res, next) => {
    const tTime = new Date();
    let emp = req.body;
    mysqlConnection.query('INSERT INTO creditTable (pId,ammount,tTime,note,type) VALUES (?,?,?,?,?)', [req.params.id, emp.ammount, tTime, emp.note,"ofc"], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});

module.exports = router;

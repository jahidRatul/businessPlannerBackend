const express = require('express');
const router = express.Router();

const mysqlConnection = require('../connection');
const { checkToken } = require('./auth/token-validation');

// Transfer debit balance
router.post('/debit/', checkToken, (req, res, next) => {
    let emp = req.body;
    const tTime = new Date();

    

    mysqlConnection.query('INSERT INTO debitTable (pId,amount,uId, tTime,note, type) VALUES (?,?,?,?,?,?)', [1, emp.amount, emp.uId, tTime, emp.note,"ofc"], (err, rows, fields) => {
        if (!err) {
            res.json({
                success: 1,
                message: " added successfully "
            });
        } else {
            console.log(err);
        }
    })

});

// Transfer credit balance
router.post('/credit/', checkToken, (req, res, next) => {
    const tTime = new Date();
    let emp = req.body;
    mysqlConnection.query('INSERT INTO creditTable (pId,amount,uId,tTime,note,type) VALUES (?,?,?,?,?,?)', [1, emp.amount, emp.uId, tTime, emp.note,"ofc"], (err, rows, fields) => {
        if (!err) {
            res.json({
                success: 1,
                message: " added successfully "
            });
        } else {
            console.log(err);
        }
    })
});

module.exports = router;

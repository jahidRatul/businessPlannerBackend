const express = require('express');
const router = express.Router();

const mysqlConnection = require('../connection');
const { checkToken } = require('./auth/token-validation');


//add employee
router.post('/employee/', checkToken, (req, res, next) => {

    let emp = req.body;
    const tTime = new Date();
    mysqlConnection.query('INSERT INTO employees (name, uId) VALUES (?,?)', [emp.name, emp.uId], (err, rows, fields) => {
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

// get all employee
router.get('/employee/user=:uId', checkToken, (req, res, next) => {
    mysqlConnection.query('SELECT * from employees where uId =?', [req.params.uId], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

//get an single employee
router.get('/employee/:id', checkToken, (req, res, next) => {
    mysqlConnection.query('SELECT * from employees WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

//update employee
router.put('/employee/:id', checkToken, (req, res, next) => {
    let emp = req.body;


    mysqlConnection.query('UPDATE employees set name = ? WHERE id = ?', [emp.name, req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

//delete an employee
router.delete('/employee/:id', checkToken, (req, res, next) => {
    mysqlConnection.query('DELETE from employees WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send('deleted successfully');
        } else {
            console.log(err);
        }
    })

});

// Transfer debit balance
router.post('/employee/debit/:id', checkToken, (req, res, next) => {
    let emp = req.body;
    const tTime = new Date().toISOString().slice(0, 19).replace('T', ' ');



    mysqlConnection.query('INSERT INTO debitTable (pId,amount, uId, tTime, note, type) VALUES (?,?,?,?,?,?)', [req.params.id, emp.amount, emp.uId, tTime, emp.note, "emp"], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

// Transfer credit balance
router.post('/employee/credit/:id', checkToken, (req, res, next) => {
    const tTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let emp = req.body;
    mysqlConnection.query('INSERT INTO creditTable (pId,amount, uId,tTime,note,type) VALUES (?,?,?,?,?,?)', [req.params.id, emp.amount, emp.uId, tTime, emp.note, "emp"], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});


module.exports = router;
const express = require('express');
const router = express.Router();

const mysqlConnection = require('../connection');


//add employee
router.post('/employee/', (req, res, next) => {

    let emp = req.body;
    console.log(emp);
    const tTime = new Date();


    mysqlConnection.query('INSERT INTO employees (name) VALUES (?)', [emp.name,], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

// get all employee
router.get('/employee', (req, res, next) => {
    mysqlConnection.query('SELECT * from employees', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

//get an single employee
router.get('/employee/:id', (req, res, next) => {
    mysqlConnection.query('SELECT * from employees WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

//update employee
router.put('/employee/:id', (req, res, next) => {
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
router.delete('/employee/:id', (req, res, next) => {
    mysqlConnection.query('DELETE from employees WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send('deleted successfully');
        } else {
            console.log(err);
        }
    })

});

// Transfer debit balance
router.post('/employee/debit/:id', (req, res, next) => {
    let emp = req.body;
    const tTime = new Date();
    mysqlConnection.query('INSERT INTO debitTable (pId,ammount,tTime,note) VALUES (?,?,?,?)', [req.params.id, emp.ammount, tTime, emp.note,], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

// Transfer credit balance
router.post('/employee/credit/:id', (req, res, next) => {
    const tTime = new Date();
    let emp = req.body;
    mysqlConnection.query('INSERT INTO creditTable (pId,ammount,tTime,note) VALUES (?,?,?,?)', [req.params.id, emp.ammount, tTime, emp.note,], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});


module.exports = router;
const express = require('express');
const router = express.Router();

const mysqlConnection = require('../connection');



// get all employee
router.get('/employee', (req, res,next) => {
    mysqlConnection.query('SELECT * from clients', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

//get an employee
router.get('/employee/:id', (req, res,next) => {
    mysqlConnection.query('SELECT * from clients WHERE uid = ?',[req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

//delete an employee
router.delete('/employee/:id', (req, res,next) => {
    mysqlConnection.query('DELETE from clients WHERE uid = ?',[req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send('deleted successfully');
        } else {
            console.log(err);
        }
    })

});

//add employee
router.post('/employee/', (req, res,next) => {
 
    let emp = req.body;
    console.log(emp);

    mysqlConnection.query('INSERT INTO clients (name, debit,credit,note) VALUES (?,?,?,?)',[emp.name,emp.debit,emp.credit,emp.note], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

//update employee
router.put('/employee/:id', (req, res,next) => {
    let emp = req.body;
    

    mysqlConnection.query('UPDATE clients set name = ?, debit = ?, credit = ?, note = ? WHERE uid = ?',[emp.name,emp.debit,emp.credit,emp.note,req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});


module.exports = router;
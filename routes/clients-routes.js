const express = require('express');
const router = express.Router();

const mysqlConnection = require('../connection');
const { checkToken } = require('./auth/token-validation');


//add clients
router.post('/client/', checkToken, (req, res, next) => {

    let clnt = req.body;
    const tTime = new Date();


    mysqlConnection.query('INSERT INTO clients (name, uId) VALUES (?,?)', [clnt.name,clnt.uId], (err, rows, fields) => {
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

// get all clients
router.get('/client', checkToken, (req, res, next) => {
    mysqlConnection.query('SELECT * from clients', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

//get an single client
router.get('/client/:id', checkToken, (req, res, next) => {
    mysqlConnection.query('SELECT * from clients WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

//update client
router.put('/client/:id', checkToken, (req, res, next) => {
    let clnt = req.body;


    mysqlConnection.query('UPDATE clients set name = ? WHERE id = ?', [clnt.name, req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

//delete an client
router.delete('/client/:id', checkToken, (req, res, next) => {
    mysqlConnection.query('DELETE from clients WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send('deleted successfully');
        } else {
            console.log(err);
        }
    })

});

// Transfer debit balance
router.post('/client/debit/:id', checkToken, (req, res, next) => {
    let clnt = req.body;
    const tTime = new Date();
    mysqlConnection.query('INSERT INTO debitTable (pId,ammount,tTime,note,type) VALUES (?,?,?,?,?)', [req.params.id, clnt.ammount, tTime, clnt.note,"client"], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

// Transfer credit balance
router.post('/client/credit/:id', checkToken, (req, res, next) => {
    const tTime = new Date();
    let clnt = req.body;
    mysqlConnection.query('INSERT INTO creditTable (pId,ammount,tTime,note,type) VALUES (?,?,?,?,?)', [req.params.id, clnt.ammount, tTime, clnt.note,"client"], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});


module.exports = router;
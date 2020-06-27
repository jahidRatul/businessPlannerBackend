const mysqlConnection = require('../connection');
const express = require('express');
const router = express.Router();
const { sign } = require("jsonwebtoken");
const { genSaltSync, hashSync, compareSync } = require('bcrypt');

const {checkToken} = require('./auth/token-validation');

//add user
router.post('/register/', (req, res, next) => {

    let usr = req.body;
    const salt = genSaltSync(10);
    usr.password = hashSync(usr.password, salt)


    mysqlConnection.query('INSERT INTO users (mobileno, name, password) VALUES (?,?,?)', [usr.mobileno, usr.name, usr.password], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);

        }
    })

});

// get all users
router.get('/user',checkToken, (req, res, next) => {
    mysqlConnection.query('SELECT * from users', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);

        }
    })

});

//get an user
router.get('/user/:number',checkToken, (req, res, next) => {
    mysqlConnection.query('SELECT * from users WHERE mobileno = ?', [req.params.number], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

//update user
router.put('/user/:number',checkToken, (req, res, next) => {
    let usr = req.body;


    mysqlConnection.query('UPDATE users set  name = ? WHERE mobileno = ?', [usr.name, req.params.number], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

//delete an user
router.delete('/user/:number',checkToken, (req, res, next) => {
    mysqlConnection.query('DELETE from users WHERE mobileno = ?', [req.params.number], (err, rows, fields) => {
        if (!err) {
            res.send('deleted successfully');
        } else {
            console.log(err);
        }
    })

});

//login an user
router.post('/login', (req, res, next) => {
    let usr = req.body;
    mysqlConnection.query('SELECT * from users WHERE mobileno = ?', [usr.mobileno], (err, rows, fields) => {
       
        if (err) {
            console.log(err);
        }
        if (!rows) {
            return res.json({
                success: 0,
                data: " Invalid Mobile Number"
            })
        }

        const result = compareSync(usr.password, rows[0].password);

        if (result) {

            rows[0].password = undefined;

            const jwt = sign({ result: rows }, "jwtSecretKey", { expiresIn: "1h" });
            
            return res.json({
                success: 1,
                message: "login successfully",
                token: jwt
            });
        }
        else {
            return res.json({
                success: 0,
                message: "invalid Mobile No or Password"
            });
        }
    });

});


module.exports = router;
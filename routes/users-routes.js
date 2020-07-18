const mysqlConnection = require('../connection');
const express = require('express');
const router = express.Router();
const { sign } = require("jsonwebtoken");
const { genSaltSync, hashSync, compareSync } = require('bcrypt');

const { checkToken } = require('./auth/token-validation');

//add user
router.post('/register/', (req, res, next) => {

    let usr = req.body;
    const salt = genSaltSync(10);
    usr.password = hashSync(usr.password, salt);
    mysqlConnection.query('INSERT INTO users (mobileno, name, password) VALUES (?,?,?)', [usr.mobileno, usr.name, usr.password], (err, rows, fields) => {
        if (!err) {
            res.json({
                success: 1,
                message: " registered successfully "
            });
        } else {
            console.log(err);
            // return res.json({
            //     success: 0,
            //     message: "Already have Account "
            // })

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
        if (rows.length === 0) {
            return res.json({
                success: 0,
                message: " Invalid Mobile Number "
            })
        }

        const result = compareSync(usr.password, rows[0].password);

        if (result) {

            rows[0].password = undefined;

            const jwt = sign({ result: rows }, "jwtSecretKey", { expiresIn: "1h" });
         

            return res.json({
                
                success: 1,
                message: "login successfully",
                name: rows[0].name,
                accId: rows[0].accId,
                token: jwt
                
                
            });
        }
        else {
            return res.json({
                success: 0,
                message: "invalid  Password"
            });
        }
    });

});

// get all users
router.get('/user', checkToken, (req, res, next) => {
    mysqlConnection.query('SELECT * from users', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);

        }
    })

});

//get an single user
router.get('/user/:id', checkToken, (req, res, next) => {
    mysqlConnection.query('SELECT * from users WHERE accId = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

//update user
router.put('/user/:id', checkToken, (req, res, next) => {
    let usr = req.body;
    const salt = genSaltSync(10);
    usr.password = hashSync(usr.password, salt);


    mysqlConnection.query('UPDATE users set  name = ?, password =?  WHERE accId = ?', [usr.name, usr.password, req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })

});

//delete an user
router.delete('/user/:id', checkToken, (req, res, next) => {
    mysqlConnection.query('DELETE from users WHERE accId = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send('deleted successfully');
        } else {
            console.log(err);
        }
    })

});


module.exports = router;
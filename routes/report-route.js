const express = require("express");
const router = express.Router();

const mysqlConnection = require("../connection");
const { checkToken } = require("./auth/token-validation");

// get all transaction for user
router.get("/report/transactions/", checkToken, (req, res, next) => {
    mysqlConnection.query(
        'select clients.name,debitTable.id,debitTable.uId,debitTable.pid,debitTable.amount,debitTable.tType,debitTable.note,debitTable.tTime,debitTable.type from debitTable  INNER JOIN clients where clients.id=debitTable.pid AND debitTable.type=clients.type AND clients.uId = ? union select employees.name,debitTable.id,debitTable.uId,debitTable.pid,debitTable.amount,debitTable.tType,debitTable.note,debitTable.tTime,debitTable.type from debitTable  INNER JOIN employees where employees.id = debitTable.pid AND debitTable.type = employees.type AND employees.uId = ? union select users.name, debitTable.id, debitTable.uId, debitTable.pid, debitTable.amount,debitTable.tType, debitTable.note, debitTable.tTime, debitTable.type from debitTable  INNER JOIN users where users.accId = debitTable.uid AND debitTable.type = "ofc" AND users.accId = ? union select clients.name, creditTable.id, creditTable.uId, creditTable.pid, creditTable.amount,creditTable.tType, creditTable.note, creditTable.tTime, creditTable.type from creditTable  INNER JOIN clients where clients.id = creditTable.pid AND creditTable.type = clients.type AND clients.uId = ? union select employees.name, creditTable.id, creditTable.uId, creditTable.pid,creditTable.amount, creditTable.tType, creditTable.note, creditTable.tTime, creditTable.type from creditTable  INNER JOIN employees where employees.id = creditTable.pid AND creditTable.type = employees.type AND employees.uId = ? union select users.name, creditTable.id, creditTable.uId, creditTable.pid, creditTable.amount, creditTable.tType, creditTable.note, creditTable.tTime, creditTable.type from creditTable  INNER JOIN users where users.accId = creditTable.uid AND creditTable.type = "ofc" AND users.accId = ? order by tTime',
        [
            req.body.uId,
            req.body.uId,
            req.body.uId,
            req.body.uId,
            req.body.uId,
            req.body.uId,
        ],
        (err, rows, fields) => {
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        }
    );
});

module.exports = router;

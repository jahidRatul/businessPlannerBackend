const express = require("express");
const router = express.Router();

const mysqlConnection = require("../connection");
const { checkToken } = require("./auth/token-validation");

// get all transaction for user
router.post('/report/transactions/all', checkToken, (req, res, next) => {
    mysqlConnection.query(
        'select clients.name,debitTable.id,debitTable.uId,debitTable.pid,debitTable.amount,debitTable.tType,debitTable.note,debitTable.tTime,debitTable.type from debitTable  INNER JOIN clients where clients.id=debitTable.pid AND debitTable.type=clients.type AND clients.uId = ? union select employees.name,debitTable.id,debitTable.uId,debitTable.pid,debitTable.amount,debitTable.tType,debitTable.note,debitTable.tTime,debitTable.type from debitTable  INNER JOIN employees where employees.id = debitTable.pid AND debitTable.type = employees.type AND employees.uId = ? union select users.name, debitTable.id, debitTable.uId, debitTable.pid, debitTable.amount,debitTable.tType, debitTable.note, debitTable.tTime, debitTable.type from debitTable  INNER JOIN users where users.accId = debitTable.uid AND debitTable.type = "ofc" AND users.accId = ? union select clients.name, creditTable.id, creditTable.uId, creditTable.pid, creditTable.amount,creditTable.tType, creditTable.note, creditTable.tTime, creditTable.type from creditTable  INNER JOIN clients where clients.id = creditTable.pid AND creditTable.type = clients.type AND clients.uId = ? union select employees.name, creditTable.id, creditTable.uId, creditTable.pid,creditTable.amount, creditTable.tType, creditTable.note, creditTable.tTime, creditTable.type from creditTable  INNER JOIN employees where employees.id = creditTable.pid AND creditTable.type = employees.type AND employees.uId = ? union select users.name, creditTable.id, creditTable.uId, creditTable.pid, creditTable.amount, creditTable.tType, creditTable.note, creditTable.tTime, creditTable.type from creditTable  INNER JOIN users where users.accId = creditTable.uid AND creditTable.type = "ofc" AND users.accId = ? order by tTime DESC',
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
// get all individual ofc, emp, client total summuary report for user
router.post("/report/transactions/currentBalanceIndividual", checkToken, (req, res, next) => {
    mysqlConnection.query(" select COALESCE(ofcCredit.total,0) as ofcCredit,COALESCE(ofcDebit.total,0) as ofcDebit,COALESCE(clientCredit.total,0) as clientCredit,COALESCE(clientDebit.total,0) as clientDebit,COALESCE(empCredit.total,0) as empCredit,COALESCE(empDebit.total,0) as empDebit, COALESCE(ofcCredit.total,0) - COALESCE(ofcDebit.total,0) as ofc, COALESCE(clientCredit.total,0)- COALESCE(clientDebit.total,0) as client,COALESCE(empCredit.total,0)- COALESCE(empDebit.total,0) as emp from (select sum(creditTable.amount) total,users.name from creditTable inner join users where users.accId=creditTable.uid AND creditTable.type='ofc' AND users.accId =?) ofcCredit, (select sum(debitTable.amount) total,users.name from debitTable inner join users where users.accId=debitTable.uid AND debitTable.type='ofc' AND users.accId =?) ofcDebit inner join (select sum(creditTable.amount) total,users.name from creditTable inner join users where users.accId=creditTable.uid AND creditTable.type='client' AND users.accId =?) clientCredit, (select sum(debitTable.amount) total,users.name from debitTable inner join users where users.accId=debitTable.uid AND debitTable.type='client' AND users.accId =?) clientDebit inner join (select sum(creditTable.amount) total,users.name from creditTable inner join users where users.accId=creditTable.uid AND creditTable.type='emp' AND users.accId =?) empCredit, (select sum(debitTable.amount) total,users.name from debitTable inner join users where users.accId=debitTable.uid AND debitTable.type='emp' AND users.accId =?) empDebit ",
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

// get all individual transaction for single client
router.post("/report/transactions/singleClient", checkToken, (req, res, next) => {
    mysqlConnection.query(" SELECT clients.name, debitTable.id, debitTable.uId, debitTable.pid, debitTable.amount, debitTable.tType, debitTable.note, debitTable.tTime, debitTable.type FROM debitTable INNER JOIN clients WHERE clients.id = debitTable.pid AND debitTable.type = clients.type AND clients.uId = ? AND clients.id =? UNION SELECT clients.name, creditTable.id, creditTable.uId, creditTable.pid, creditTable.amount, creditTable.tType, creditTable.note, creditTable.tTime, creditTable.type FROM creditTable INNER JOIN clients WHERE clients.id = creditTable.pid AND creditTable.type = clients.type AND clients.uId = ? And clients.id =? ORDER BY tTime DESC ",
        [
            req.body.uId,
            req.body.id,
            req.body.uId,
            req.body.id,

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
// get all individual summery report for single client
router.post("/report/transactions/singleClientSummary", checkToken, (req, res, next) => {
    mysqlConnection.query("SELECT COALESCE(debitSum.total,0) AS total_debit, COALESCE(creditSum.total,0) AS total_credit, COALESCE(creditSum.total,0) - COALESCE(debitSum.total,0) AS balance FROM (SELECT clients.name, SUM(debitTable.amount) AS total FROM debitTable INNER JOIN clients WHERE clients.id = debitTable.pid AND debitTable.type = clients.type AND clients.uId = ? AND clients.id = ?) AS debitSum, (SELECT clients.name, SUM(creditTable.amount) AS total FROM creditTable INNER JOIN clients WHERE clients.id = creditTable.pid AND creditTable.type = clients.type AND clients.uId = ? AND clients.id = ?) AS creditSum ",
        [
            req.body.uId,
            req.body.id,
            req.body.uId,
            req.body.id,

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

// get all individual transaction for single emp
router.post("/report/transactions/singleEmployee", checkToken, (req, res, next) => {
    mysqlConnection.query(" SELECT employees.name, debitTable.id, debitTable.uId, debitTable.pid, debitTable.amount, debitTable.tType, debitTable.note, debitTable.tTime, debitTable.type FROM debitTable INNER JOIN employees WHERE employees.id = debitTable.pid AND debitTable.type = employees.type AND employees.uId = ? AND employees.id =? UNION SELECT employees.name, creditTable.id, creditTable.uId, creditTable.pid, creditTable.amount, creditTable.tType, creditTable.note, creditTable.tTime, creditTable.type FROM creditTable INNER JOIN employees WHERE employees.id = creditTable.pid AND creditTable.type = employees.type AND employees.uId = ? And employees.id =? ORDER BY tTime DESC ",
        [
            req.body.uId,
            req.body.id,
            req.body.uId,
            req.body.id,

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

// get all individual summery report for single employee
router.post("/report/transactions/singleEmployeeSummary", checkToken, (req, res, next) => {
    mysqlConnection.query("SELECT COALESCE(debitSum.total,0) AS total_debit, COALESCE(creditSum.total,0) AS total_credit, COALESCE(creditSum.total,0) - COALESCE(debitSum.total,0) AS balance FROM (SELECT employees.name, SUM(debitTable.amount) AS total FROM debitTable INNER JOIN employees WHERE employees.id = debitTable.pid AND debitTable.type = employees.type AND employees.uId = ? AND employees.id = ?) AS debitSum, (SELECT employees.name, SUM(creditTable.amount) AS total FROM creditTable INNER JOIN employees WHERE employees.id = creditTable.pid AND creditTable.type = employees.type AND employees.uId = ? AND employees.id = ?) AS creditSum",
        [
            req.body.uId,
            req.body.id,
            req.body.uId,
            req.body.id,

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





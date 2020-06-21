const express = require('express');
const  bodyParser = require('body-parser');


const employeesRouter = require('./routes/employees-routes');

const app = express();

app.use(bodyParser.json());

app.use('/api/employees', employeesRouter);

app.listen(5000);
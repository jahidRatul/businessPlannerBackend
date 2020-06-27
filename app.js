const express = require('express');
const  bodyParser = require('body-parser');

const employeesRouter = require('./routes/employees-routes');
const usersRouter = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use('/api/employees', employeesRouter);
app.use('/api/users', usersRouter);

app.listen(5000);
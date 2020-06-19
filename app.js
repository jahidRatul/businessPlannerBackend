const express = require('express');

const employeesRouter = require('./routes/employees-routes');

const app = express();

app.use('/api/employees', employeesRouter);

app.listen(5000);
const express = require('express');
const  bodyParser = require('body-parser');

const usersRouter = require('./routes/users-routes');
const clientsRouter = require('./routes/clients-routes');
const employeesRouter = require('./routes/employees-routes');
const officeRouter = require('./routes/office-routes');
const reportRouter = require('./routes/report-route');

const app = express();

app.use(bodyParser.json());

app.use('/api/users', usersRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/office', officeRouter);
app.use('/api/reports', reportRouter);



app.listen(5000);
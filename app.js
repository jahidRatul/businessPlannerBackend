const express = require('express');
const  bodyParser = require('body-parser');

const usersRouter = require('./routes/users-routes');
const clientsRouter = require('./routes/clients-routes');
const employeesRouter = require('./routes/employees-routes');
const officeRouter = require('./routes/office-routes');

const app = express();

app.use(bodyParser.json());

app.use('/api/users', usersRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/office', officeRouter);



app.listen(5000);
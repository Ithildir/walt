const express = require('express');
const helmet = require('helmet');
const getPromiseRouter = require('express-promise-router');
const buildDialogflowRoutes = require('./routes/dialogflow');
const { handleErrors, handleInstrumentation } = require('./middlewares');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(handleInstrumentation);

const router = getPromiseRouter();

buildDialogflowRoutes(router);

app.use('/', router);

app.use(handleErrors);

module.exports = app;

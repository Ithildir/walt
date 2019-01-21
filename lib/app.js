const express = require('express');
const helmet = require('helmet');
const getPromiseRouter = require('express-promise-router');
const buildCronRoutes = require('./cron/buildRoutes');
const buildBotRoutes = require('./bot/buildRoutes');
const { handleErrors } = require('./middleware');

const app = express();

app.use(helmet());
app.use(express.json());

const router = getPromiseRouter();

buildBotRoutes(router);
buildCronRoutes(router);

app.use('/', router);

app.use(handleErrors);

module.exports = app;

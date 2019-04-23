import * as express from 'express';

const apiRoute = require('./api');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRoute);

module.exports = app;

app.listen(3001, () => console.log('media-viewer-sandbox-api is working on 3001!'));

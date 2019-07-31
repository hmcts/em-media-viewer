var express = require('express');
var bodyParser = require('body-parser');
var app = express();
// var fs = require("fs");

app.use(bodyParser.json());

app.get('/em-anno/annotation-sets/filter', function (req, res) {
  var documentId = req.query.documentId;

  if (documentId.endsWith('example.pdf')) {
    res.json({
      id: 1,
      documentId: 'example.pdf',
      annotations: []
    });
  }

});

app.post('/em-anno/annotation-set', function (req, res) {

  var json = req.body;

  json.id = '' + Math.floor(Math.random() + 10000);

  res.json(json);

});

app.post('/em-anno/annotation', function (req, res) {

  var json = req.body;

  res.json(json);

});

app.delete('/em-anno/annotation/:id', function (req, res) {
  res.end('');

});

var server = app.listen(9999, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})

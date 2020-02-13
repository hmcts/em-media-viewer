var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.get('/em-anno/annotation-sets/filter', function (req, res) {

  res.status(404);
  res.end();

});

app.post('/em-anno/annotation-sets', function (req, res) {

  var json = req.body;

  json.annotations = [];

  res.json(json);

});

app.post('/em-anno/annotations', function (req, res) {

  var json = req.body;

  res.json(json);

});

app.delete('/em-anno/annotations/:id', function (req, res) {
  res.end('');

});

var server = app.listen(1337, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})

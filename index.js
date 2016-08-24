var express = require('express');
var app = express();
var path = require('path');

var exec = require('child_process').exec;

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

app.use(express.static('src'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/getShoeSize', function(req, res) {
  var footDimensions = {};
  execute("python testImg.py", function(response){
      response.split('\n').map(function(v, i) {
        if(v && v !== 'Cleaned up camera.') {
          footDimensions[i] = v;
        }
      });
      //console.log(footDimensions);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(footDimensions));
  });
});

app.listen(3000, function () {
  console.log('App Running at http://localhost:3000');
});

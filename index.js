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
  var ranSize = (Math.random() * (12.5 - 3.5) + 3.5).toFixed(2);
  var testData = {
    'shoeSize': 10,
    0: ranSize,
    1: (ranSize*0.25).toFixed(2),
    2: ranSize,
    3: (ranSize*0.25).toFixed(2)
  };

  var mensSizes = {
    '9.25': 6,
    '9.5': 6.5,
    '9.625': 7,
    '9.75': 7.5,
    '9.9375': 8,
    '10.125': 8.5,
    '10.25': 9,
    '10.4375': 9.5,
    '10.5625': 10,
    '10.75': 10.5,
    '10.9375': 11,
    '11.125': 11.5,
    '11.25': 12,
    '11.5625': 13,
    '11.875': 14,
    '12.1875': 15,
    '12.5': 16
  };

  var womensSizes = {
    '8.1875': 4,
    '8.375': 4.5,
    '8.5': 5,
    '8.75': 5.5,
    '8.875': 6,
    '9.0625': 6.5,
    '9.25': 7,
    '9.375': 7.5,
    '9.5': 8,
    '9.6875': 8.5,
    '9.875': 9,
    '10': 9.5,
    '10.1875': 10,
    '10.3125': 10.5,
    '10.5': 11,
    '10.6875': 11.5,
    '10.875': 12
  };

  var bigKidSizes = {
    '8.625': 3.5,
    '8.75': 4,
    '9': 4.5,
    '9.125': 5,
    '9.25': 5.5,
    '9.5': 6,
    '9.625': 6.5,
    '9.75': 7
  };

  var littleKidSizes = {
    '6.625': 10.5,
    '6.75': 11,
    '7': 11.5,
    '7.125': 12,
    '7.25': 12.5,
    '7.5': 13,
    '7.625': 13.5,
    '7.75': 1,
    '8': 1.5,
    '8.125': 2,
    '8.25': 2.5,
    '8.5': 3,
  };

  var infantSizes = {
    '3.125': 0,
    '3.5': 1,
    '3.625': 1.5,
    '3.75': 2,
    '4': 2.5,
    '4.125': 3
  };

  var toddlerSizes = {
    '4.25': 3.5,
    '4.5': 4,
    '4.625': 4.5,
    '4.75': 5,
    '5': 5.5,
    '5.125': 6,
    '5.25': 6.5,
    '5.5': 7,
    '5.625': 7.5,
    '5.75': 8,
    '6': 8.5,
    '6.125': 9,
    '6.25': 9.5,
    '6.5': 10
  };

  function getSizeChart(gender) {
    var sizeChart = {
      'Adult': gender === 'male' ? mensSizes : womensSizes,
      'Big Kid': gender === 'male' ? bigKidSizes : '',
      'Little Kid': littleKidSizes,
      'Toddler': toddlerSizes,
      'Infant': infantSizes
    };

    return sizeChart;
  }

  execute("python testImg.py", function(response){
    var footDimensions = {};
    response.split('\n').map(function(v, i) {
      if(v && v !== 'Cleaned up camera.') {
        footDimensions[i] = v;
      }
    });
    footDimensions = Object.keys(footDimensions).length > 2 ? footDimensions : testData;

    // GET FOOT SIZE
    var sizeChart = getSizeChart('female');

    for(var key in sizeChart) {
      for(var i = 0; i < Object.keys(sizeChart[key]).length; i++) {
        var minVal = parseFloat(Object.keys(sizeChart[key])[i]);
        var maxVal = parseFloat(Object.keys(sizeChart[key])[i+1]);
        if(footDimensions[0] >= minVal && footDimensions[0] <= maxVal) {
          testData.shoeSize = sizeChart[key][maxVal] + ' ' + key;
        }
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(footDimensions));
  });
});

app.listen(3000, function () {
  console.log('App Running at http://localhost:3000');
});

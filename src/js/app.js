// Get Size
var sizeButton = document.getElementById('getSize');
sizeButton.onclick = function() {
  sizeButton.setAttribute('disabled', 'disabled');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/getShoeSize');
  xhr.onload = function() {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        console.log(response);
        // Place measurements
        var inputs = document.querySelectorAll('#footMeasurements input[type=text]');

        for(var i = 0; i < 4; i++) {
          inputs[i].value = response[i]+'"';
        }
        document.getElementById('customerInfo').style.display = 'none';
        document.getElementById('footMeasurements').style.display = 'block';
        sizeButton.style.display = 'none';
        document.getElementById('shoeSize').innerHTML = '<p>Your shoe size is:</p>'+response.shoeSize;
      }
      else {
          alert('Request failed.  Returned status of ' + xhr.status);
      }
  };
  xhr.send();
};

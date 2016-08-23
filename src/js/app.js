var sizeButton = document.getElementById('getSize');
sizeButton.onclick = function() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/getShoeSize');
  xhr.onload = function() {
      if (xhr.status === 200) {
          alert('Shoe size is ' + xhr.responseText);
      }
      else {
          alert('Request failed.  Returned status of ' + xhr.status);
      }
  };
  xhr.send();
};

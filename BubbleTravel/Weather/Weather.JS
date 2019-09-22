const key = '2013cbb8d05f985325a7945757d64373';
if(key=='') document.getElementById('temp').innerHTML = ('Remember to add your api key!');

function weatherBallon( cityName ) {
	fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName+ '&appid=' + key)  
	.then(function(resp) { return resp.json() }) // Convert data to json
	.then(function(data) {
		drawWeather(data);
	})
	.catch(function() {
		// catch any errors
	});
}
function drawWeather( d ) {
  var celcius = Math.round(parseFloat(d.main.temp)-273.15);
	var fahrenheit = Math.round(((parseFloat(d.main.temp)-273.15)*1.8)+32);
  var description = d.weather[0].description; 
	
	document.getElementById('description').innerHTML = description;
	document.getElementById('temp').innerHTML = celcius + '&deg;';
	document.getElementById('location').innerHTML = d.name;
  
  if( description.indexOf('rain') > 0 ) {
  	document.body.className = 'rainy';
  } else if( description.indexOf('cloud') > 0 ) {
  	document.body.className = 'cloudy';
  } else if( description.indexOf('sunny') > 0 ) {
  	document.body.className = 'sunny';
  } else {
  	document.body.className = 'clear';
  }
}

//get by defult
window.onload = function() {
	console.log(document.getElementById("city").value);
	weatherBallon('Tel aviv');	
}

function movePage3() {
	
	window.location.replace("Enter url of page here!");
}

//get from input
function myFunc() {
	var x = document.getElementById("city").value;
	weatherBallon(x);	
	console.log(x);
	return x;
}


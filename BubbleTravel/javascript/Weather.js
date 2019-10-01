const key = '2013cbb8d05f985325a7945757d64373';
if (key == '') document.getElementById('temp').innerHTML = ('Remember to add your api key!');

function weatherBallon(cityName) {
	fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + key)
		.then(function (resp) { return resp.json() }) // Convert data to json
		.then(function (data) {
			drawWeather(data.list);
		})
		.catch(function () {
			// catch any errors
		});
}
function drawWeather(d) {
	let descString = 'description';
	let tempString = 'temp';
	let dayString = 'day';
	let iconString = 'im';
	let iconURL = "https://openweathermap.org/img/wn/";
	let index = 0;
	let i;
	for (i = 0; i < d.length; i++) {
		if((i == 0) || (d[i].dt_txt.includes('00:00:00'))) {
			let newDesc = descString.concat(index);
			let newTemp = tempString.concat(index);
			let newDay = dayString.concat(index);
			let newIm = iconString.concat(index);
			
			var celcius = Math.round(parseFloat(d[i].main.temp_max) - 273.15);
			var description = d[i].weather[0].description;
			var name = getDayName(d[i].dt_txt);

			document.getElementById(newDesc).innerHTML = description;
			document.getElementById(newTemp).innerHTML = celcius + '&deg;';
			document.getElementById(newDay).innerHTML = name;
			document.getElementById(newIm).setAttribute("src",iconURL.concat(d[i].weather[0].icon).concat(".png"));

			index++;
			if(index == 5) {
				break;
			}
		}
	}
}

//get by defult
window.onload = function () {
	weatherBallon('LONDON');
}

function movePage3() {

	window.location.replace("Enter url of page here!");
}

//get from input
function myFunc() {
	var x = document.getElementById("city").value;
	weatherBallon(x);
	return x;
}

function myFunc_v2(x) {
	weatherBallon(x);
	return x;
}

function getDayName(dateStr) {
	let locale = 'en-GB';
	var date = new Date(dateStr);
	return date.toLocaleDateString(locale, { weekday: 'long' });
}
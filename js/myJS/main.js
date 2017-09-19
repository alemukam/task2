//hide the weather tab at first
$('#weather-container').hide();

//slider
//slider click events are written directly in HTML - #prev and #next
var index = 1;

function plusIndex(n, event) {
	event.preventDefault();
	index += n;
	responsiveSlider(index);
}

function responsiveSlider(n) {
	var x = document.getElementsByClassName('slider-child');

	if (n > x.length) {
		index = 1;
	}

	if (n < 1) {
		index = x.length;
	}

	for (var i = 0; i < x.length; i++) {
		x[i].style.display = 'none';
	}

	x[index - 1].style.display = 'block';

}


//class for input forms
function inputForms(name) {
	//jQuery selector
	this.jquery = $(name);

	//disables a button or a checkbox
	this.disableElement = function() {
		this.jquery.prop('disabled', true);
	}

	//enables a button or a checkbox
	this.enableElement = function() {
		this.jquery.prop('disabled', false);
	}

	//whrther is checked
	this.isChecked = function() {
		var status = this.jquery.prop('checked');
		if (status === true) {
			return true;
		} else {
			return false;
		}
	}
}

//instantiating classes
var btnDown = new inputForms('button[name=down]');
var btnUp = new inputForms('button[name=up]');
var checkCelsius = new inputForms('input[name=celsius]');
var checkFahrenheit = new inputForms('input[name=fahrenheit]');

//initial number of days -> value in input[name=days]
var daysCount = 5;

//in order to make the button DOWN inactive as soon as the page loads
if (daysCount === 5) {
	btnDown.disableElement();
}

//some functions
//checks which button should be active and which inactive. Called inside click events
function daysChecker() {
	if (daysCount === 5) {
		//button DOWN is disabled as soon as 5 days areselected
		btnDown.disableElement();
	} else if (daysCount === 16) {
		//button UP is disabled as soon as 16 days are selected
		//$('button[name=up]').prop('disabled', true);
		btnUp.disableElement();
	} else if (daysCount === 6 || daysCount === 15) {
		//as soon as the days are changed back to 6 or 15 both buttons are enables. Otherwise the code is not run
		btnDown.enableElement();
		btnUp.enableElement();
	}
}

//checks whether there are only letters in the city input form
function cityInputLetters(value) {
	var letters = /^[A-Za-zĀ-Žā-ž]+$/; //includes latvian characters as well
	if (value.match(letters)) {
		return true;
	} else {
		return false;
	}
}

//Chart.js object TEST
var chartData = {
    labels: [], //x values
    datasets: [{
      label: '',
      fill: false,
      borderColor: 'rgb(17, 94, 219)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      lineTension: 0,
      data: [1,2,3,4,5]
    },    {
      //night line - datasets[1]
      label: '',
      fill: false,
      backgroundColor: 'rgba(45, 0, 229, 0.2)',
      borderColor: 'black',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      lineTension: 0,
      data: [4,2,13,5,12]
    }]
  };
  var ctx = document.getElementById('lineChart');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: chartData
  });

//When the city form is being completed
//P.S. Value of the input is checked after clicking the "Get Weather" button as well
$('input[name=city]').keyup(function(e) {
	//run the further code only if letters (65 - 90) or backspace (8) are clicked
	$('#citiesDropdown').html('');
	var keyValue = e.keyCode;
	if ((keyValue === 8) || (keyValue === 16) || (keyValue === 18) || (keyValue >= 65 && keyValue <= 90)) {
		var city = $('input[name=city]').val();
		//checking if the name of the city is capitalized or not
		if (city !== '') {
			//if the first letter has not been capitlized by the user
			if (city[0] !== city[0].toUpperCase()) {
				var capitalizedFirstLetter = city[0].toUpperCase();
				
				//making the city name capitalized
				if (city.length === 1) {
					city = capitalizedFirstLetter;
				} else {
					city = capitalizedFirstLetter + city.substring(1, city.length);
				}

			}
		}

		//connecting to JSON file with names of Latvian cities (inside the first if statement)
		var myGithubLink = 'https://alemukam.github.io/lvcities/LVcities.json';
		$.get(myGithubLink, function(data) {
			//loop through the city names
			for (var i = 0; i < data.length; i++) {
				var cityName = data[i].name;
				var cityChecker = cityName.match(city);
				//var cityOutput = city + cityName.substring(city.length, cityName.length)

				//if cityChecker finds a match (is not null) and if the city input is not empty
				if (cityChecker !== null && city !== '') {
					$('<p>').html('<span style="color: red; font-weight: bold; text-decoration: underline;">' + city + '</span>' + cityName.substring(city.length, cityName.length)).appendTo('#citiesDropdown').addClass('citiesValues');
				}
			}

			$('.citiesValues').on('click', function() {
				var cityText = $(this).text();
				$('input[name=cityVal]').attr('value', cityText);
			});
		});

	} //end of the first if statement (with keyValues)
});

//close the dropdown
$('html').on('click', function(e) {
	if (!$(e.target).closest('#citiesDropdown').length) {
		$('#citiesDropdown').html('');
	}
});


// incements days after the button UP is clicked
$('button[name=up]').on('click', function() {
	if (daysCount >= 5 && daysCount < 16) {
		$('input[name=days]').attr('value', daysCount += 1);
	}
	daysChecker();
});

//decrements days after the button DOWN is clicked
$('button[name=down]').on('click', function() {
	if (daysCount > 5 && daysCount <= 16) {
		$('input[name=days]').attr('value', daysCount -= 1);
	}
	daysChecker();
});

//Makes Fahrenheit checkbox inactive as soon as Celsius is checked
$('input[name=celsius]').on('click', function() {
	if (checkCelsius.isChecked()) {
		//if checked -> disable Fahrenheit
		checkFahrenheit.disableElement();
	} else {
		//if not checked -> enable Fahrenheit
		checkFahrenheit.enableElement();
	}
});

//Makes Celsius checkbox inactive as soon as Fahreinheit is checked
$('input[name=fahrenheit]').on('click', function() {
	if (checkFahrenheit.isChecked()) {
		//if checked -> disable Celsius
		checkCelsius.disableElement();
	} else {
		//if not checked -> enable Celsius
		checkCelsius.enableElement();
	}
});

//Click the button to get results
$('button[name=submit]').on('click', function() {
	$('#error-text-temp').text(''); //should be empty by default and after resubmitting the request
	var city = $('input[name=cityVal]').val();
	//Error handlers - city name is checked first. After that - units of temperature
	//if no city is selected
	if (city === '') {
		$('#error-text-city').text('Please enter a city');
		$('input[name=cityVal]').addClass('inputError');
	} else {
		$('#error-text-city').text('');
		$('input[name=cityVal]').removeClass('inputError');

		//if no unit of temperature is selected
		if (!checkCelsius.isChecked() && !checkFahrenheit.isChecked()) {
			$('#error-text-temp').text('Please select a unit of temperature');
		} else {
			//get a unit of temperature
			if (checkCelsius.isChecked()) {
				var units = 'metric';
			} else if (checkFahrenheit.isChecked()) {
				var units = 'imperial';
			}
			//API key
			var apiKey = '675ca8f129c1ee936b57ae92a87c3f72';

			//run the API
			var apiLink = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + city + '&mode=xml&units=' + units + '&cnt=' + daysCount + '&APPID=' + apiKey;

			//AJAX
			$.ajax({
				type: 'GET',
				url: apiLink,
				dataType: 'xml',
				success: xmlParser

			});
		}
	}
});

function xmlParser(xml) {
	//0. Manipulations with charset arrays. Clearing them as soon as the Parser is run. They are filled later
		//not necessary to clear data arrays because chart.js is visible by labels
		chartData.labels = [];

	//1. making the tab visible
		$('#weather-container').hide(); //for recurring reloads of the weather tab (smooth transition)
		$('#weather-container').fadeIn();

	//2. Making some standard variables
		var date = $(xml).find('time');
		var img = $(xml).find('symbol');
		var temp = $(xml).find('temperature');

	//3. Weather tab - header
		//getting variables
		var cityName = $(xml).find('name').text();
		var firstDate = date[0].getAttribute('day');
		var latsDate = date[date.length - 1].getAttribute('day');
		//defining unist of temperature (for some reason not present in the XML file)
		if (checkCelsius.isChecked()) {
			var units = '°C';
			var unitText = 'Celsius ' + units;
		} else if (checkFahrenheit.isChecked()) {
			var units = '°F';
			var unitText = 'Fahrenheit ' + units;
		}

		//editing the header panel (#w-firstRow)
		$('#city-container').html('<h2>Location: <span class="bold">' + cityName + '</span></h2>');
		$('#date-container').html('<h3>From ' + firstDate + ' to ' + latsDate + '</h3>');
		$('#unit-container').html('<h3>Unit of temperature: ' + unitText + '</h3>');

	//4. Weather tab - table
		var tableContent = '<table class="table table-striped">' + 
				'<thead><tr class="active"><th>Date</th><th>Image</th><th>Day ' + units + '</th><th>Night ' + units + '</th></tr></thead>' +
				'<tbody>';
	//5. Weather tab - slider
		var sliderScreens = '';

	//6. Weather tab - line chart
		var dataDay = chartData.datasets[0];
		var dataNight = chartData.datasets[1];

		dataDay.label = 'Day ' + units;
		dataNight.label = 'Night ' + units;
		
		for (var i = 0; i < date.length; i++) {
			//getting variables - table
			var dates = date[i].getAttribute('day');
			var imgLinks = img[i].getAttribute('var');
			var imgNames = img[i].getAttribute('name');
			var dayTemps = temp[i].getAttribute('day');
			var nightTemps = temp[i].getAttribute('night');

			//adding <td>'s to the table
			tableContent += '<tr><td>' + dates + '</td><td><img src="http://openweathermap.org/img/w/' + imgLinks + '.png" alt="' + imgNames + '" width="40px" />' + '</td><td>' + dayTemps + '</td><td>' + nightTemps + '</td></tr>';

			//creating .slider-child with bootstrap formating (3 columns)
			sliderScreens += '<div class="slider-child">' +
							'<div class="col-xs-4 text-center"><h3>' + dates + '</h3><img src="http://openweathermap.org/img/w/' + imgLinks + '.png" alt="' + imgNames + '" width="100px" /></div>' +
							'<div class="col-xs-4 text-center"><h3>' + 'Day ' + units + '</h3><h3>' + dayTemps + '</h3></div>' +
							'<div class="col-xs-4 text-center"><h3>' + 'Night ' + units + '</h3><h3>' + nightTemps + '</h3></div>' +
							'</div>';

			//adding the data to the line chart - name,
			chartData.labels[i] = dates;
			dataDay.data[i] = dayTemps;
			dataNight.data[i] = nightTemps;

		} //loop ends here

		myChart.update(); //update the line chart !important

		//finish the table variable
		tableContent += '</tbody></table>';

		//edit the table panel (#table-container)
		$('#table-container').html(tableContent);

		//edit the slider panel (#sliderWrap)
		$('#sliderWrap').html(sliderScreens);
		responsiveSlider(1); //make the first slide visible - other slider are
}
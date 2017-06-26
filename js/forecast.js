var Forecast = (function () {

    function Forecast (root) {
        this.root = document.querySelector(root);
        this.cityNameField = this.root.querySelector('.cityName'); 
        this.modeNavWrapper = this.root.querySelector('.forecast-mode-nav');
        this.curDateWrapper = this.root.querySelector('.cur-date');

        this.forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=';
        this.curWeatherUrl = 'http://api.openweathermap.org/data/2.5/weather?q=';
        this.weatherImgUrl = 'http://openweathermap.org/img/w/';
        this.openWeatherAppId = 'c80165ba743f1fe7bf5a6865ca960644';
        this.numDays = '16';

        this.selectedMode = this.root.querySelector('.temperature-mode');
        this.modeChart = 'temperature';

        this.addEvents();
    };


    //check if geolocaion is allowes
    Forecast.prototype.checkCurLocation = function () {
        var self = this;

        if (navigator.geolocation) {
            return this.getCurCoords();
        } else {
           this.geolocationNorSupported();
        }       
    };

    //add error msg if geolocation is blockes for browser
    Forecast.prototype.geolocationNorSupported = function () {
        var noCurPOs = helper.create('div', { 
                class : 'no-geolocation', 
                text : 'Geolocation is not supported by this browser!'
            });
        var content = helper.getEl('.forecast-content', this.target);

        content.appendChild(noCurPOs);
    };

    //get current location by geolocation
    Forecast.prototype.getCurCoords = function () {
        var self = this;

        navigator.geolocation.getCurrentPosition (
            function (pos) {
                var coord = pos.coords,
                    lat = coord.latitude,
                    lng = coord.longitude;

                var city = self.getCurCityName(lat, lng);
            }, 

            function (error) {
                if (error.code == error.PERMISSION_DENIED) {
                    var noCurPOs = helper.create('div', { 
                        class : 'no-geolocation', 
                        text : "The geolocation is declined! Reload the page and try again. Or you can type the city you want and get the forecast!"
                    });
                    var content = helper.getEl('.forecast-content', this.target);
                    content.appendChild(noCurPOs);
                }                                        
            }
        );
    };

    //get and write the name of city via geolocation and Geocoder, then get current weather for current location
    Forecast.prototype.getCurCityName = function (lat, lng) {
        var self = this;
        var geocoder = new google.maps.Geocoder();

        var latlng = new google.maps.LatLng(lat, lng);

        geocoder.geocode( {'latLng': latlng}, function ( results, status ) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    for (var i=0; i<results[0].address_components.length; i++) {
                        for (var b=0;b<results[0].address_components[i].types.length;b++) {

                            if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                                var city = results[0].address_components[3].short_name + ', ' +  results[0].address_components[6].short_name;
                                
                                self.getForecast(city);
                                self.getCurrentWeather(city);
                                self.cityNameField.value = city;                        
                            }
                        }
                    }                    
                }
            }   
        });        
    };


    //get datas for current weather
    Forecast.prototype.getCurrentWeather = function (city) {
        var self = this,
            url = this.curWeatherUrl + city + '&units=metric' + '&APPID=' + this.openWeatherAppId,
            cityNameField = helper.getEl('.area', this.target),            
            temperatureField = helper.getEl('.cur-temperature', this.target),
            
            pressureField = helper.getEl('.pressure-val', this.target),
            humidityField = helper.getEl('.humidity-val', this.target),
            windField = helper.getEl('.wind-val', this.target),
            cloudsField = helper.getEl('.clouds-val', this.target);

        AJAX.GET(url, function (data) {
            var city = data.name + ', ' + data.sys.country,
                temperature = parseInt(data.main.temp) + '\xB0' +' C',

                pressure = data.main.pressure,
                humidity = data.main.humidity,
                wind = parseInt(data.wind.speed),
                clouds = data.clouds.all;

            self.setCurWeatherMode(data);

            cityNameField.innerHTML = city;
            temperatureField.innerHTML = temperature;

            pressureField.innerHTML = pressure;
            humidityField.innerHTML = humidity;
            windField.innerHTML = wind + 'm/s';
            cloudsField.innerHTML = clouds + '%';
        });
    };

    //create box with mode weather and icon for current weather
    Forecast.prototype.setCurWeatherMode = function (data) {
        var curWeatherMode = helper.getEl('.cur-mode-weather', this.target),

            iconWeatherUrl = this.weatherImgUrl + data.weather[0].icon + '.png',
            iconWeather = helper.create('img', {
                src: iconWeatherUrl
            }),
            weatherStr = data.weather[0].description,
            modeWeather = weatherStr.charAt(0).toUpperCase() + weatherStr.slice(1);
        
        curWeatherMode.innerHTML = '';

        var iconWeatherWrapper = helper.create('span', {
            class: 'icon-weather-wrapper',
        });
        iconWeatherWrapper.appendChild(iconWeather);

        var modeWeatherWrapper = helper.create('span', {
            class: 'mode-weather-wrapper',
            text: modeWeather
        });

        curWeatherMode.appendChild(iconWeatherWrapper);
        curWeatherMode.appendChild(modeWeatherWrapper);
    };
   

    //highlight button for temp/pressure/wind/humidity
    Forecast.prototype.highlightMode = function (node) {
        if (this.selectedMode) {
            this.selectedMode.classList.remove('active');
          }
          this.selectedMode = node;
          this.selectedMode.classList.add('active');
    };


    //show current Date
    Forecast.prototype.showCurDate = function () {
        var now = new Date(),
            month = now.getMonthName(),
            weekDay = now.getWeekDay(),
            day = now.getDate();

        var date = weekDay + ', ' + day + ' ' + month;
        this.curDateWrapper.innerHTML = date;
    };
    Date.prototype.getMonthName = function() {
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        return months[ this.getMonth() ];
    };

    Date.prototype.getWeekDay = function() {
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        return days[ this.getDay() ];
    };
    //END-----------show current Date


     Forecast.prototype.getForecast = function (city) {
        var self = this,
            url = this.forecastUrl + city + '&units=metric' + '&cnt=' + this.numDays +'&APPID=' + this.openWeatherAppId;
            
        AJAX.GET(url, function (data) {
            console.log(data);
            window.meteogram = new Meteogram(data, 'chart', self.modeChart); 
        });
       
    };

    Forecast.prototype.addEvents = function () {
        var self = this,
            cityVal = this.cityNameField.value;

        this.checkCurLocation();    
        this.showCurDate();         

        this.cityNameField.addEventListener('keypress', function (e) {
            cityVal = self.cityNameField.value;
            if(e.keyCode === 13) {

                var errorMsg = helper.getEl('.no-geolocation', this.target);
                    if (errorMsg) {
                    helper.getEl('.forecast-content', this.target).removeChild(errorMsg);
                }

                self.getForecast(cityVal);
                self.getCurrentWeather(cityVal);
            }

            

        });

        helper.addEvent('click', self.modeNavWrapper, function (e) {
            var target = e.target;
            if ( !helper.hasClass(target, 'nav-item') ) return;
            self.highlightMode(target);

            self.modeChart = target.getAttribute('data-mode');
            cityVal = self.cityNameField.value;
            self.getForecast(cityVal);
        });

        
    };

    return Forecast;
})();

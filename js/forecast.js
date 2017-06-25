var Forecast = (function () {

    function Forecast (root) {
        this.root = document.querySelector(root);
        this.cityNameField = this.root.querySelector('.cityName'); 
        this.modeNavWrapper = this.root.querySelector('.forecast-mode-nav');
        this.forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=';
        this.curWeatherUrl = 'http://api.openweathermap.org/data/2.5/weather?q=';
        this.openWeatherAppId = 'c80165ba743f1fe7bf5a6865ca960644';
        this.numDays = '16';
        this.selectedMode = this.root.querySelector('.temperature-mode');
        this.modeChart = 'temperature';

        this.addEvents();
    };

    Forecast.prototype.checkCurLocation = function () {
        var self = this;

        if (navigator.geolocation) {
            return self.getCurCoords();
        } else {
            var noCurPOs = helper.create('div', { 
                class : 'no-geolocation', 
                test : 'Geolocation is not supported by this browser!'
            });
            var content = helper.getEl('.forecast-content', this.target);
            content.appendChild(noCurPOs);
        }       
    };

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
                        text : "The geolocation is blocked, so you can't see the forecast for you location!"
                    });
                    var content = helper.getEl('.forecast-content', this.target);
                    content.appendChild(noCurPOs);
                }                                        
            }
        );
    };

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
                                self.setCurrentWeather(city);
                                self.cityNameField.value = city;                        
                            }
                        }
                    }                    
                }
            }   
        });
        
    };

    Forecast.prototype.setCurrentWeather = function (city) {
        var self = this,
            url = this.curWeatherUrl + city + '&units=metric' + '&APPID=' + this.openWeatherAppId,
            cityNameField = helper.getEl('.area', this.target),
            pressureField = helper.getEl('.pressure-val', this.target);

        AJAX.GET(url, function (data) { 
            var city = data.name + ', ' + data.sys.country,
                pressure = data.main.pressure;

            cityNameField.innerHTML = city;
            pressureField.innerHTML = pressure; 
        });
    };  

    Forecast.prototype.getForecast = function (city) {
        var self = this,
            url = this.forecastUrl + city + '&units=metric' + '&cnt=' + this.numDays +'&APPID=' + this.openWeatherAppId;
            
        AJAX.GET(url, function (data) {
            console.log(data);
            window.meteogram = new Meteogram(data, 'chart', self.modeChart); 
        });
       
    };

    Forecast.prototype.highlightMode = function (node) {
        if (this.selectedMode) {
            this.selectedMode.classList.remove('active');
          }
          this.selectedMode = node;
          this.selectedMode.classList.add('active');
    };

    Forecast.prototype.addEvents = function () {
        var self = this,
            cityVal = this.cityNameField.value;

        this.checkCurLocation();             

        this.cityNameField.addEventListener('keypress', function (e) {
            cityVal = self.cityNameField.value;
            if(e.keyCode === 13) {
                self.getForecast(cityVal);
                self.setCurrentWeather(cityVal);
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

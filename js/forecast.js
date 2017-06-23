var Forecast = (function () {

	function Forecast (root) {
		this.root = document.querySelector(root);
        this.cityNameField = this.root.querySelector('.cityName');
        this.cityVal = this.cityNameField.value;        
		this.openWeatherUrl = 'http://api.openweathermap.org/data/2.5/forecast';
		this.openWeatherAppId = 'c80165ba743f1fe7bf5a6865ca960644',

        this.addEvents();
	}


	Forecast.prototype.getDatas = function () {
        var self = this,
        	var url      

		AJAX.GET('openWeatherUrl', function (data) {
            
        });
       
    }

    Forecast.prototype.addEvents = function () {
        var self = this;       

        this.cityNameField.addEventListener('keypress', function (e) {
            if(e.keyCode === 13) {
                self.getDatas(self.cityNameField);
            }
        });
    }

	return Forecast;
})();
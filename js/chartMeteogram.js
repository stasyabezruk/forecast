var Meteogram = (function () {

	function Meteogram(data, container, modeWeather) {
	   	this.data = data;
	    this.container = container;
	    this.modeWeather = modeWeather;

	    this.dates = [];
	    this.temperatures = [];	
	    this.pressures = [];
	    this.humidify = [];
	    this.wind = [];   
	    this.parseData();
	};

	Meteogram.prototype.parseData = function () {
		var self = this,
        	data = this.data;

        data.list.forEach( function (forecast, i) {
        	var temp = parseInt(forecast.temp.eve);
        	self.temperatures.push(temp);
        });

        this.createChart();
	};

	Meteogram.prototype.createChart = function () {
	    var self = this,
	    	options = this.getTemperatureOptions();

	    if ( this.modeWeather == 'pressure') {
			options = this.getPressureOptions();
	    } else if ( this.modeWeather == 'humidify') {
			options = this.getHumidifyOptions();
	    } else if ( this.modeWeather == 'widn') {
			options = this.getWindOptions();
	    }

	    this.chart = new Highcharts.Chart(options);
	};

	//Build and return the Highcharts options structure 
	Meteogram.prototype.getTemperatureOptions = function () {
	    var self = this;

	    return {
	        chart: {
	            renderTo: this.container,
	       		type: 'column'
	        },
	        title: {
        		text: null
    		},

	        xAxis: {
	        	type: 'datetime',
        		dateTimeLabelFormats: {
            		day: '%e %b'
        		}
	        },

	        yAxis: [{				
				title: { text: null },
				maxPadding: 0.2,
				tickPositioner: function () {
	                var max = Math.ceil(this.max) + 1,
	                    pos = max - 12, // start
	                    ret;

	                if (pos < this.min) {
	                    ret = [];
	                    while (pos <= max) {
	                        ret.push(pos += 1);
	                    }
	                } // else return undefined and go auto
	                return ret;
	            },
	            labels: {
			        formatter: function() {
			            return this.value + '\xB0C';
			        }
			    }			     
	        }],
	        
	        legend: {
		        enabled: false
		    },

	        series: [{
	            name: 'Temperature',
	            data: self.temperatures,
	            pointStart: self.getCurDate(),
        		pointInterval: 24 * 3600 * 1000,// one day
        		tooltip: { 
        			valueSuffix: '\xB0C'
            	},
            	color: '#ffa9a9'
	        }]
	    };
	};

    Meteogram.prototype.getCurDate = function () {       
         var d = new Date();
         var date = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
         return date;
    };


	return Meteogram;
})();
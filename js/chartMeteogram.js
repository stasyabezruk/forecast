var Meteogram = (function () {

	function Meteogram(data, container, modeWeather) {
	   	this.data = data;
	    this.container = container;
	    this.modeWeather = modeWeather;

	    this.dates = [];
	    this.temperatures = [];	
	    this.pressures = [];
	    this.humidity = [];
	    this.windSpeed = [];   
	    this.parseData();
	};

	Meteogram.prototype.parseData = function () {
		var self = this,
        	data = this.data;

        data.list.forEach( function (forecast, i) {
        	var temp = parseInt(forecast.temp.eve),
        		wind = parseInt(forecast.speed),
        		hum = parseInt(forecast.humidity),
        		pres = parseInt(forecast.pressure);

        	self.temperatures.push(temp);
        	self.windSpeed.push(wind);
        	self.humidity.push(hum);
        	self.pressures.push(pres);
        });

        this.createChart();
	};

	Meteogram.prototype.createChart = function () {
	    var self = this,
	    	options = this.getTemperatureOptions();

	    if ( this.modeWeather == 'pressure') {
			options = this.getPressureOptions();
	    } else if ( this.modeWeather == 'humidity') {
			options = this.getHumidityOptions();
	    } else if ( this.modeWeather == 'wind') {
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
	       		type: 'column',
	       		backgroundColor: '#f7f7f7',

	       		spacingBottom: 20,
	        	spacingTop: 40,
		        spacingLeft: 20,
		        spacingRight: 20
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
            	color: '#ffa9a9',
            	negativeColor: '#48AFE8'
	        }]
	    };
	};

	Meteogram.prototype.getWindOptions = function () {
	    var self = this;

	    return {
	        chart: {
	            renderTo: this.container,
	       		type: 'spline',
	       		backgroundColor: '#f7f7f7',

	       		spacingBottom: 20,
	        	spacingTop: 40,
		        spacingLeft: 20,
		        spacingRight: 20
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
				min: 0,				
	            labels: {
			        formatter: function() {
			            return this.value + 'm/s';
			        }
			    },
			    plotBands: [{ // Light air
		            from: 0.3,
		            to: 1.5,
		            color: 'rgba(68, 170, 213, 0.1)',
		            label: {
		                text: 'Light air',
		                style: {
		                    color: '#606060'
		                }
		            }
		        }, { // Light breeze
		            from: 1.5,
		            to: 3.3,
		            color: 'rgba(0, 0, 0, 0)',
		            label: {
		                text: 'Light breeze',
		                style: {
		                    color: '#606060'
		                }
	            }
		        }, { // Gentle breeze
		            from: 3.3,
		            to: 5.5,
		            color: 'rgba(68, 170, 213, 0.1)',
		            label: {
		                text: 'Gentle breeze',
		                style: {
		                    color: '#606060'
		                }
		            }
		        }, { // Moderate breeze
		            from: 5.5,
		            to: 8,
		            color: 'rgba(0, 0, 0, 0)',
		            label: {
		                text: 'Moderate breeze',
		                style: {
		                    color: '#606060'
		                }
		            }
		        }, { // Fresh breeze
		            from: 8,
		            to: 11,
		            color: 'rgba(68, 170, 213, 0.1)',
		            label: {
		                text: 'Fresh breeze',
		                style: {
		                    color: '#606060'
		                }
		            }
		        }, { // Strong breeze
		            from: 11,
		            to: 14,
		            color: 'rgba(0, 0, 0, 0)',
		            label: {
		                text: 'Strong breeze',
		                style: {
		                    color: '#606060'
		                }
		            }
		        }, { // High wind
		            from: 14,
		            to: 15,
		            color: 'rgba(68, 170, 213, 0.1)',
		            label: {
		                text: 'High wind',
		                style: {
		                    color: '#606060'
		                }
		            }
		        }]			     
	        }],

	        legend: {
		        enabled: false
		    },

	        series: [{
	            name: 'Wind Speed',
	            data: self.windSpeed,
	            pointStart: self.getCurDate(),
        		pointInterval: 24 * 3600 * 1000,// one day
        		tooltip: { 
        			valueSuffix: 'm/s'
            	}
	        }]
	    };
	};

	Meteogram.prototype.getPressureOptions = function () {
	    var self = this;

	    return {
	        chart: {
	            renderTo: this.container,
	       		type: 'area',
	       		backgroundColor: '#f7f7f7',

	       		spacingBottom: 20,
	        	spacingTop: 40,
		        spacingLeft: 20,
		        spacingRight: 20
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
	            data: self.pressures,
	            pointStart: self.getCurDate(),
        		pointInterval: 24 * 3600 * 1000,// one day
        		tooltip: { 
        			valueSuffix: '\xB0C'
            	},
            	color: '#6ccec5',
            	negativeColor: '#48AFE8'
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
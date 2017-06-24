var Meteogram = (function () {

	function Meteogram(data, container, modeWeather) {
		debugger;
	   	this.data = data;
	    this.container = container;

	    this.dates = [];
	    this.temperatures = [];	   
	    this.parseData();
	};

	Meteogram.prototype.parseData = function () {
		var self = this,
        	data = this.data;

        data.list.forEach( function (forecast, i) {
        	var temp = parseInt(forecast.temp.eve);
        	self.temperatures.push(temp);
        });

        console.log(self.temperatures);
        this.createChart();
	};

	Meteogram.prototype.createChart = function () {
	    var self = this;
	    this.chart = new Highcharts.Chart(this.getChartOptions());
	};

	//Build and return the Highcharts options structure 
	Meteogram.prototype.getChartOptions = function () {
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
				tickInterval: 1
	        }],

	        series: [{
	            name: 'Temperature',
	            data: self.temperatures,
	            pointStart: self.getCurDate(),
        		pointInterval: 24 * 3600 * 1000 // one day
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
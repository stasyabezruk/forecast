var Meteogram = (function () {

	function Meteogram(data, container) {
	   
	    this.temperatures = [];

	    this.data = data;
	    this.container = container;

	   
	    this.parseData();
	};

	Meteogram.prototype.parseData = function () {
		var self = this,
        	data = this.data;

        data.list.forEach( function (forecast, i) {
        	var temp = forecast.temp.eve;
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

	        xAxis: {},

	        yAxis: [{
				tickInterval: 1
	        }],

	        series: [{
	            name: 'Temperature',
	            data: self.temperatures
	        }]
	    };
	};


	return Meteogram;
})();
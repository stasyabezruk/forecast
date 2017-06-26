Used API:
<ul>
  <li>http://openweathermap.org/</li>
  <li>https://www.highcharts.com/</li>
</ul>

gulp default - compile to min.css and watch less

First the app uses your geolocation to get the forecast. Then you can type any city you want.<br>
If the geolocation is blocked by browser/is declined by user, there will an error message.<br>
<br>
You get the current weather and the forecast for 16 days with 4 charts:<br>
- temperature;
- wind speed;
- pressure;
- humidity and clouds.<br><br>
The app contains 2 main classes - functions-contructors: Forecast and Meteogram.

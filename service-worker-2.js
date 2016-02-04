importScripts('node_modules/sw-toolbox/sw-toolbox.js');

var dataCacheName = 'weatherData-v1';
var cacheName = 'weatherPWA-step-celebrate-1';
var filesToCache = [
  './',
  './index.html',
  './scripts/app.js',
  './images/clear.png',
  './images/cloudy-scattered-showers.png',
  './images/cloudy.png',
  './images/fog.png',
  './images/ic_add_white_24px.svg',
  './images/ic_refresh_white_24px.svg',
  './images/partly-cloudy.png',
  './images/rain.png',
  './images/scattered-showers.png',
  './images/sleet.png',
  './images/snow.png',
  './images/thunderstorm.png',
  './images/wind.png'
];

console.log(toolbox);

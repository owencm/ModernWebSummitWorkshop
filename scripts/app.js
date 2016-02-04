
(function() {
  'use strict';

  var app = {
    isLoading: true,
    hasRequestPending: false,
    visibleCards: {},
    selectedCityKeys: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('#container'),
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  document.getElementById('butRefresh').addEventListener('click', function() {
    // Refresh all of the forecasts
    app.updateForecasts();
  });

  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Updates a weather card with the latest weather forecast. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateForecastCard = function(cityKey, data) {
    var card = app.visibleCards[cityKey];
    if (!card) {
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      card.querySelector('.location').textContent = data.city;
      card.removeAttribute('hidden');
      app.container.appendChild(card);
      app.visibleCards[cityKey] = card;
    }
    card.querySelector('.date').textContent =
      new Date(data.currently.time * 1000);
    // card.querySelector('.current .temperature .value').textContent =
      // Math.round(data.currently.temperature);
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };


  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  // Gets a forecast for a specific city
  app.getForecast = function(cityKey) {
    var url = 'data/' + cityKey + '.json';
    app.hasRequestPending = true;
    // Make the XHR to get the data, then update the card
    return fetch(url).then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
    }).then(function(data){
      app.hasRequestPending = false;
      console.log('[App] Forecast Updated From Network');
      return data;
    });
  };

  // Iterate all of the cards and attempt to get the latest forecast data
  app.updateForecasts = function() {
    var keys = Object.keys(app.visibleCards);
    keys.forEach(function(key) {
      app.getForecast(key);
    });
  };

  /*****************************************************************************
   *
   * Code required to start the app
   *
   * NOTE: To simplify this getting started guide, we've used localStorage.
   *   localStorage is a syncronous API and has serious performance
   *   implications. It should not be used in production applications!
   *   Instead, check out IDB (https://www.npmjs.com/package/idb) or
   *   SimpleDB (https://gist.github.com/inexorabletash/c8069c042b734519680c)
   *
   ****************************************************************************/

  app.selectedCityKeys = [ 'newyork' ];
  app.selectedCityKeys.forEach(function(cityKey) {
    app.getForecast(cityKey).then(function (forecast) {
      app.updateForecastCard(cityKey, forecast);
    });
  });


  // Add feature check for Service Workers here
  if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }

})();

'use strict';

/*****************************************************************************
 *
 * Setup the core app model
 *
 ****************************************************************************/

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
  card.querySelector('.temperature').innerHTML =
    Math.round(data.currently.temperature) + '&deg;F';
  if (app.isLoading) {
    app.spinner.setAttribute('hidden', true);
    app.container.removeAttribute('hidden');
    app.isLoading = false;
  }
};

/*****************************************************************************
 *
 * Event listeners for the UI
 *
 ****************************************************************************/

document.querySelector('#butNotif').addEventListener('click', function () {
  var pushClient = new goog.propel.Client({
    workerUrl: 'service-worker.js', endpointUrl: 'push'
  });
});

/*****************************************************************************
 *
 * Methods for dealing with the network
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


/*****************************************************************************
 *
 * Start the app
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

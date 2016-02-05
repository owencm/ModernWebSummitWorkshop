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

document.querySelector('#butNotif').addEventListener('click', (e) => {

});

/*****************************************************************************
*
* Methods for dealing with the network
*
****************************************************************************/

// Gets a forecast for a specific city
app.getForecast = function(cityKey) {
  var url = '../data/' + cityKey + '.json';
  app.hasRequestPending = true;
  // Make the XHR to get the data, then update the card
  return fetch(url).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
  }).then((data) => {
    app.hasRequestPending = false;
    return data;
  });
};

/*****************************************************************************
*
* Start the app
*
****************************************************************************/

app.selectedCityKeys = [
  'austin',
  'baltimore',
  'boston',
  'chicago',
  'dallas',
  'losangeles',
  'newyork',
  'sanfrancisco',
];

app.selectedCityKeys.forEach((cityKey) => {
  app.getForecast(cityKey).then((forecast) => {
    app.updateForecastCard(cityKey, forecast);
  });
});

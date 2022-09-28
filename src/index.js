import './css/styles.css';
import API from './fetchCountries';
import getRefs from './get-refs';
import cartCountry from './cart';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

let debounce = require('lodash.debounce');
const refs = getRefs();
const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onNameCountry, DEBOUNCE_DELAY));

function onNameCountry(evt) {
  evt.preventDefault();
  const form = evt.currentTarget;
  const countriesSearch = refs.input.value.trim();

  if (countriesSearch === '') {
    refs.countryList.innerHTML = '';
    return;
  }

  API.fetchCountries(countriesSearch)
    .then(handleCountryCard)
    .catch(onFetchError);
}

function handleCountryCard(countries) {
  if (countries.length > 10) {
    Notify.success(
      'Too many matches found. Please enter a more specific name.'
    );
    refs.countryList.innerHTML = '';
    return;
  }

  if (countries.length === 1) {
    const makeCountry = countries
      .map(country => cartCountry(country))
      .join(' ');
    return (refs.countryList.innerHTML = makeCountry);
  }

  const makeCountries = countries
    .map(country => {
      return `<div class = "country_name">  
        <img class="image_country" src=${country.flags.svg}
        alt=${country.name.official}
        width="60" 
        />
        <p>${country.name.official}</p>   
       </div>`;
    })
    .join('');
  refs.countryList.innerHTML = makeCountries;
}

function onFetchError(error) {
  Notify.failure('Oops, there is no country with that name');
  refs.input.value = '';
}

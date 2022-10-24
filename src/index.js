
import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import {fetchCountries} from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
    search:document.querySelector('input#search-box'),
    countriesList:document.querySelector('.country-list'),
    countriesInfo:document.querySelector('.country-info'),
}; 

refs.search.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
const searching = String(refs.search.value);
clearSeacrh();

if(searching.trim()){
    fetchCountries(searching)
    .then(countries => {
        if(countries.length > 10){
            Notiflix.Notify.info(
                'Too many matches found. Please enter a more specific name.'
                );
        }else if(countries.length >= 2 && countries.length < 10){
            renderMarkupCountires(countries);
        }else if(countries.length === 1) {
            renderCountryCard(countries);
        }
    })
    .catch(error => { 
        Notiflix.Notify.failure('Oops, there is no country with that name')
    });
    
}
}

function clearSeacrh() {
    refs.countriesInfo.innerHTML = '';
    refs.countriesList.innerHTML = '';
}

function renderMarkupCountires(countries = []) {
   clearSeacrh();
    const renderCountries = countries.map(country => {
        return `
          <li class="country-list__item">
            <img class="country-list__icon" width="40px" height="30px"
             src="${country.flags.svg}" alt="${country.name.official}">
            <span class="country-list__countryName">
              ${country.name.official}
            </span>
          </li>
        `;
      })
      .join('');
    refs.countriesList.innerHTML = renderCountries;
  }
  
  function renderCountryCard(countries = []) {
   clearSeacrh();
    const renderCountries = countries.map(country => {
        return `
          <div class="country-info__item">
            <img class="country-list__icon" src="${country.flags.svg}" alt="
        ${
          country.name.official
        }" width="60px" height="auto" />
            <h2 class="country-info__title">${country.name.official}</h2>
          </div>
          <div class="article-wrapper">
            <p class="country-info__article">
              Capital: <span class="country-info__span">${country.capital}</span></p>
          </div>
          <div class="article-wrapper">
            <p class="country-info__article">
              Population: <span class="country-info__span">${country.population}</span></p>
          </div>
          <div class="article-wrapper">
            <p class="country-info__article">
              Languages: <span class="country-info__span">${Object.values(
              country.languages
            ).join(',')}</span></p>
          </div>
        `;
      })
      .join('');
    refs.countriesInfo.innerHTML = renderCountries;
  }
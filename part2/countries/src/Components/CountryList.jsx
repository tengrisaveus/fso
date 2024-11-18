import React from 'react'

const CountryList = ({ countries, onShowCountry }) => {
  if (countries.length === 1) {
    const country = countries[0]
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area} km²</p>
        <h3>Languages:</h3>
        <ul>
          {Object.values(country.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
      </div>
    )
  }

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.cca3}>
          {country.name.common} <button onClick={() => onShowCountry(country)}>show</button>
        </li>
      ))}
    </ul>
  )
}

export default CountryList
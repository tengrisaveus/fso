import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './Components/Filter'
import CountryList from './Components/CountryList'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)


  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data))
  }, [])

  useEffect(() => {
    if (selectedCountry) {
      const apiKey = 'a4b42993d7534165b32111622241811'
      const capital = selectedCountry.capital[0]
      axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${capital}`)
        .then(response => setWeather(response.data))
    }
  }, [selectedCountry])

  const countriesToShow = selectedCountry
    ? [selectedCountry]
    : countries.filter((country) => 
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      )

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setSelectedCountry(null)
    setWeather(null)
  }

  const handleShowCountry = (country) => setSelectedCountry(country)

  return (
    <div>
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      {countriesToShow.length > 10 ? (
        <p>Too many matches</p>
      ) : (
        <CountryList countries={countriesToShow} onShowCountry={handleShowCountry} />
      )}
      {weather && (
        <div>
          <h3>Weather in {selectedCountry.capital[0]}</h3>
          <p>Temperature: {weather.current.temp_c} °C</p>
          <p>Condition: {weather.current.condition.text}</p>
          <img src={weather.current.condition.icon} alt="Weather icon" />
        </div>
      )}
    </div>
  )
}

export default App

import { useEffect, useState } from 'react'
import Filter from './Components/Filter'
import PersonForm from './Components/PersonForm'
import Persons from './Components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if(!confirmUpdate) return

      const updatedPerson = {...existingPerson, number: newNumber}

      personService
        .update(existingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id !== existingPerson.id ? person : returnedPerson
            )
          )
          setNewName('')
          setNewNumber('')
        })
    
    } else {
      const newPerson = { name: newName, number: newNumber }

      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch((error) => {
          console.error('Error adding person:', error)
        })
    }
  }

  const deletePerson = (id, name) =>{
    const confirmDelete = window.confirm(`Delete ${name}`)
    if(!confirmDelete) return
    
    personService
    .remove(id)
    .then(() =>{
      setPersons(persons.filter(person => person.id !== id))
    })
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearchChange = (event) => setSearchTerm(event.target.value)

  const personsToShow = persons.filter((person) => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      
      <h3>Add a new</h3>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App

import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    
    const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(content))
    dispatch(showNotification(`you created '${content}'`, 5))
  }

  return(
  <form onSubmit={addAnecdote}>
        <div>
          <input name ="anecdote" />
        </div>
        <button>create</button>
      </form>
  )
}

export default AnecdoteForm
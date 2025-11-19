import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)

  const vote = id => {
    dispatch(voteAnecdote(id))
    const voted = anecdotes.find(a => a.id === id)
    if(voted){
      dispatch(showNotification(`you voted '${voted.content}'`, 5))
    }
    
  }

  const filtered = anecdotes.filter(a =>
    a.content.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      {[...filtered]
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Anecdotes
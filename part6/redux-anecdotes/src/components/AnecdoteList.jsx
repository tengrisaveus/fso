import { useDispatch, useSelector } from 'react-redux'
import { updateAnecdoteVotes } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)

 const vote = (anecdote) => {
    dispatch(updateAnecdoteVotes(anecdote))
   dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
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
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Anecdotes
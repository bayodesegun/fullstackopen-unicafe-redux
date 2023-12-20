import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setTimedNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'


const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const create = (event) => {
    event.preventDefault()
    const text = event.target.anecdote.value
    const data = { content: text, votes: 0 }
    anecdoteService.create(data).then(anecdote => dispatch(createAnecdote(anecdote)))
    event.target.anecdote.value = ''
    dispatch(setTimedNotification(`You created "${text}"`, 5))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={create} id='create-anecdote-form'>
        <div><input type='text' name='anecdote' required /></div>
        <button type='submit' id='create-anecdote'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm

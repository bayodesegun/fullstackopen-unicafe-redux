import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import store from './store'
import App from './App'


describe('<App /> root component (integration)', () => {
  let container

  beforeAll(() => {
    console.warn = jest.fn()
  })

  beforeEach(() => {
    container = render(
      <Provider store={store}>
        <App />
      </Provider>
    ).container
  })

  test('renders correctly', async () => {
    const title = screen.getByText('Anecdotes')
    expect(title).not.toBeNull()

    const filterText = screen.getByText('filter')
    expect(filterText).not.toBe(null)
    const input = container.querySelector('input[name="anecdote_filter"]')
    expect(input).not.toBeNull()

    const anecdotes = container.querySelectorAll('.anecdote')
    expect(anecdotes.length).toBeGreaterThan(0)

    const anecdote = anecdotes[0]
    expect(anecdote).not.toBeNull()
    expect(anecdote.textContent).toContain('has 0')
    const btn = anecdote.querySelector('button')
    expect(btn).not.toBeNull()
    expect(btn.textContent).toBe('vote')

    const createNew = screen.getByText('create new')
    expect(createNew).not.toBeNull()
    const form = container.querySelector('#create-anecdote-form')
    expect(form).not.toBeNull()
  })

  test('can vote an anecdote', async () => {
    const user = userEvent.setup()

    const anecdote = container.querySelectorAll('.anecdote')[0]
    expect(anecdote.textContent).toContain('has 0')

    const voteBtn = anecdote.querySelector('button')
    await user.click(voteBtn)
    expect(anecdote.textContent).toContain('has 1')
  })

  test('can create an anecdote', async () => {
    const user = userEvent.setup()
    const initialAnecdotes = container.querySelectorAll('.anecdote')

    const anecdoteInput = container.querySelector('input[name="anecdote"]')
    expect(anecdoteInput).not.toBe(null)
    const anecdote = 'This is a new anectdote'
    await user.type(anecdoteInput, anecdote)
    expect(anecdoteInput.value).toBe(anecdote)
    const form = container.querySelector('#create-anecdote-form')
    expect(form).not.toBe(null)
    fireEvent.submit(form, { target : { anecdote : { value : anecdote }}})

    const finalAnectdotes = container.querySelectorAll('.anecdote')
    expect(finalAnectdotes.length).toBe(initialAnecdotes.length + 1)
  })

  test('filter works correctly', async () => {
    const user = userEvent.setup()
    const initialAnecdotes = container.querySelectorAll('.anecdote')
    const filter = store.getState().anecdotes[0].content.split(' ')[0]

    const input = container.querySelector('input[name="anecdote_filter"]')
    await user.type(input, filter)

    const finalAnectdotes = container.querySelectorAll('.anecdote')
    expect(finalAnectdotes.length).toBeLessThan(initialAnecdotes.length)
  })
})

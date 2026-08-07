import reducer from './usersReducer'
import { FETCH_USERS } from '../actions/types'

const users = [{ id: 1, firstname: 'A', lastname: 'B' }]

it('starts out loading', () => {
  expect(reducer(undefined, { type: '@@INIT' })).toEqual({
    items: [],
    loading: true,
    error: null
  })
})

it('replaces the list rather than appending to it', () => {
  let state = reducer(undefined, { type: FETCH_USERS, payload: users })
  expect(state.items).toHaveLength(1)

  // The mistake the sibling thunk repo used to make: a second fetch showed everyone
  // twice, because the reducer concatenated.
  state = reducer(state, { type: FETCH_USERS, payload: users })
  expect(state.items).toHaveLength(1)
})

// redux-promise re-dispatches with error: true and the rejection as the payload when
// the promise rejects. That flag is the whole failure channel the middleware offers.
it('reads the Flux Standard Action error flag', () => {
  const state = reducer(undefined, {
    type: FETCH_USERS,
    error: true,
    payload: new Error('Network Error')
  })
  expect(state).toEqual({ items: [], loading: false, error: 'Network Error' })
})

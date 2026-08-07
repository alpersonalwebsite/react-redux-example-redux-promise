import { FETCH_USERS } from '../actions/types'

const initialState = {
  items: [],
  loading: true,
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS:
      // redux-promise re-dispatches with error: true and the rejection as the payload
      // when the promise rejects, following the Flux Standard Action convention. That
      // one flag is the entire failure channel the middleware gives you, which is the
      // honest trade against a thunk: nothing to write, and nowhere to put anything
      // more specific.
      if (action.error) {
        return { items: [], loading: false, error: action.payload.message }
      }

      // Replace, never append: a FETCH_USERS payload is the current answer to "who are
      // the users", not an increment of it.
      return { items: action.payload, loading: false, error: null }

    default:
      return state
  }
}

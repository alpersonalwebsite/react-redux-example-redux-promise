import axios from 'axios'
import { FETCH_USERS } from './types'

import { API, limitUserResults, offsetUserResults, readUsers } from '../apiConfiguration'

const headers = {
  Accept: 'application/json'
}

// The whole of redux-promise in one action creator: return an action whose PAYLOAD is
// a promise, and the middleware waits for it, then re-dispatches the same action with
// the resolved value in its place. The reducer only ever sees a settled payload.
//
// Compare with the thunk version, which returns a FUNCTION and dispatches by hand.
// Less machinery here, and correspondingly less control: there is no "started" moment
// to hang a loading flag on, because the action creator returns once and the
// middleware does the rest.
export const fetchUsers = () => ({
  type: FETCH_USERS,
  payload: axios
    .get(API, { headers, params: { limit: limitUserResults, offset: offsetUserResults } })
    .then(response => readUsers(response.data))
})

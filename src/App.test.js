import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxPromise from 'redux-promise'

import rootReducer from './reducers'
import App from './App'
import axios from 'axios'

// axios is mocked because mounting App dispatches fetchUsers, which would otherwise fire
// a real request at REACT_APP_API_URL. A test called "renders without crashing" should
// not depend on a local API being up, or on there being a network at all.
//
// jest.mock is hoisted above the imports by babel-plugin-jest-hoist wherever it is
// written, so keeping it below them costs nothing and keeps import/first happy.
jest.mock('axios')

// App is connect()ed, so it needs a store in context. The middleware matters here too:
// without redux-promise the action's promise payload reaches the reducer unresolved.
beforeEach(() => {
  axios.get.mockResolvedValue({ data: { data: [] } })
})

it('renders without crashing', () => {
  const store = createStore(rootReducer, applyMiddleware(reduxPromise))
  const div = document.createElement('div')

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    div
  )

  ReactDOM.unmountComponentAtNode(div)
})

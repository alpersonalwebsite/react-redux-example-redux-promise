import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxPromise from 'redux-promise'

import rootReducer from './reducers'
import App from './App'

// App is connect()ed, so it needs a store in context. The middleware matters here too:
// without redux-promise the action's promise payload reaches the reducer unresolved.
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

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './store/reducers'

import App from './Containers/App/index'
import registerServiceWorker from './registerServiceWorker'

// Styles
import './styles/main.scss'

const store = createStore(reducers, applyMiddleware(thunk))
const ROOT_NODE = document.getElementById('root')

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  ROOT_NODE
)
registerServiceWorker()

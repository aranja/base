import { applyMiddleware, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { syncHistory, routeReducer } from 'react-router-redux'
import { history } from './router'
import createLogger from 'redux-logger'

// Reducers.
const reducers = combineReducers({
  routing: routeReducer,
})

// Sync dispatched route actions to the history
const reduxRouterMiddleware = syncHistory(history)

const store = createStore(
  reducers,
  applyMiddleware(
    thunk,
    reduxRouterMiddleware,
    createLogger,
  )
)

// Required for replaying actions from devtools to work
reduxRouterMiddleware.listenForReplays(store)

export default store

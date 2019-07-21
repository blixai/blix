import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers/rootReducer'

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

export const configureStore = () => {
  return createStore(
    rootReducer,
    devTools
  )
}
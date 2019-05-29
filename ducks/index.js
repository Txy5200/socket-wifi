import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer, persistCombineReducers } from 'redux-persist'
import thunk from 'redux-thunk'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import { user, signin, signout } from './user'
import { serialport, openPort, closePort } from './serialport'

const persistConfig = {
  key: 'root',
  storage
}

const appReducer = persistCombineReducers(persistConfig, {
  user,
  serialport
})

const rootReducer = (state, action) => {
  if (action.type === 'USER_SIGNOUT') {
    state = {}
  }
  return appReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const middleware = [thunk]

const store = createStore(persistedReducer, {}, compose(applyMiddleware(...middleware)))
const persistor = persistStore(store, null, () => store.getState())

export { store, persistor }

// actions
export {
  signin,
  signout,
  openPort,
  closePort
}

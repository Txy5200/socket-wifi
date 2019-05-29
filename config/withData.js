import React from 'react'
import { Provider } from 'react-redux'
import { store, persistor } from '../ducks'
import { PersistGate } from 'redux-persist/integration/react'

export default function (Component) {
  class Auth extends React.Component {
    constructor(props) {
      super(props)
      this.state = { token: undefined }
    }

    componentDidMount() {
      try {

      } catch (e) {
        console.log('get Token Error', e)
      }
    }

    render() {
      return (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Component url={this.props.url} />
          </PersistGate>
        </Provider>
      )
    }
  }
  return Auth
}

import withData from '../config/withData'
import Head from '../modules/common/screens/head'
import { SocketScreen } from '../modules/socket_screen'
import { TITLE } from '../config'

export default withData(props => {
  return (
    <main>
      <Head title={TITLE} />
      <SocketScreen {...props} />
    </main>
  )
})

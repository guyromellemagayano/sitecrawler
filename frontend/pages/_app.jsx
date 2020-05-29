import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'

import '../styles.css'

library.add(fab)

const App = ({ Component, pageProps }) => {
  return (
    <Component {...pageProps} />
  )
}

export default App
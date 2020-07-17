import React from 'react'
import { SWRConfig } from 'swr'
import LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'
import fetchJson from '../hooks/fetchJson'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'

import '../css/styles.css'

library.add(fab)

if (typeof window !== 'undefined') {
  LogRocket.init('app/id');
  setupLogRocketReact(LogRocket);
}

const App = ({ Component, pageProps }) => {
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        revalidateOnFocus: true,
        onError: (err) => {
          console.error(err)
        },
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  )
}

export default App
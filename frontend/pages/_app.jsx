import React from 'react'
import { SWRConfig } from 'swr'
import fetchJson from '../hooks/fetchJson'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'

import '../css/styles.css'

library.add(fab)

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
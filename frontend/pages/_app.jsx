import dynamic from 'next/dynamic'
import { SWRConfig } from 'swr'
import fetchJson from '../hooks/fetchJson'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'

import '../css/styles.css'
import "nprogress/nprogress.css";

library.add(fab)

const TopProgressBar = dynamic(
  () => {
    return import("components/utils/TopProgressBar");
  },
  { ssr: false },
)

const App = ({ Component, pageProps }) => {
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        revalidateOnFocus: true,
        // onError: (err) => {
        //   console.error(err)
        // },
      }}
    >
      <TopProgressBar />
      <Component {...pageProps} />
    </SWRConfig>
  )
}

export default App
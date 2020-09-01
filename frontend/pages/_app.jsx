import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { SWRConfig } from 'swr'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import fetchJson from 'hooks/fetchJson'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'

import 'css/styles.css'
import 'nprogress/nprogress.css';

library.add(fab)

const TopProgressBar = dynamic(
  () => {
    return import("components/utils/TopProgressBar");
  },
  { ssr: false },
)

const App = ({ Component, pageProps }) => {
  const stripePromise = loadStripe('pk_test_X7IuKvLaHFgKe7x4ixhwlKQZ')

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
      <Elements stripe={stripePromise}>
        <Component {...pageProps} />
      </Elements>
    </SWRConfig>
  )
}

export default App
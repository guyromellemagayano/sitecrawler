import { Fragment } from 'react'
import Head from 'next/head'
import styled from 'styled-components'

const PrivacyPolicyDiv = styled.div``

const PrivacyPolicy = () => {
  const pageTitle = 'Privacy Policy'
  
  return (
    <Fragment>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <PrivacyPolicyDiv></PrivacyPolicyDiv>
    </Fragment>
  )
}

export default PrivacyPolicy
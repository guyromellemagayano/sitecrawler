import { Fragment } from 'react'
import Head from 'next/head'
import styled from 'styled-components'

const ServiceTermsDiv = styled.div``

const ServiceTerms = () => {
  const pageTitle = 'Terms of Service'
  
  return (
    <Fragment>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <ServiceTermsDiv></ServiceTermsDiv>
    </Fragment>
  )
}

export default ServiceTerms
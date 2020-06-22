import React from 'react'
import styled from 'styled-components'
import Header from './layout/Header'
import Footer from './layout/Footer'

const Main = styled.main``

const Layout = ({ children }) => {
  return (
    <>
      <div id="root">
        <Header />
        <Main>{children}</Main>
        <Footer />
      </div>
    </>
  )
}

export default Layout
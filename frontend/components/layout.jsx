import React from 'react'
import styled from 'styled-components'
import Header from './header'
import Footer from './footer'

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
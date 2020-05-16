import React from "react"
import Header from "components/header"
import Footer from "components/footer"

const Layout = () => {
  const { children } = this.props

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
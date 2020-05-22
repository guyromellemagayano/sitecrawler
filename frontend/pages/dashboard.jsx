import { useState } from 'react'
import Head from 'next/head'
import styled from 'styled-components'

const DashboardDiv = styled.section``

const Dashboard = () => {
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <DashboardDiv>
      </DashboardDiv>
    </>
  )
}

export default Dashboard

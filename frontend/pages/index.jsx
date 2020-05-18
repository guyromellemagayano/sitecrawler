import Head from 'next/head'
import Layout from '../src/components/layout'

const Home = () => {
  return (
    <>
      <Layout>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="container">
          <h1>Welcome to Homepage</h1>
        </div>

        <footer></footer>
      </Layout>
    </>
  );
}

export default Home

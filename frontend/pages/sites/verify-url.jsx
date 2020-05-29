import { useCallback, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Router from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import styled from 'styled-components'
import useUser from '../../hooks/use-user'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Layout from '../../components/layout'
import MobileSidebar from '../../components/sidebar/mobile-sidebar'
import Sidebar from '../../components/sidebar/main-sidebar'
import fetch from 'node-fetch'

const SitesVerifyUrlDiv = styled.section`
  ol {
    list-style-type: decimal;
    margin-left: 1rem;
  }

  .wizard-indicator {
    height: 0.25rem;
  }
`

const SitesVerifyUrl = props => {
  const { user } = useUser({ redirectTo: '/login' })

  if (!user) {
    return <Layout>Loading...</Layout>
  }

  const [copyValue, setCopyValue] = useState(`<meta name="epic-crawl-id" content="${props.vid}">`)
  const [copied, setCopied] = useState(false)
  const [siteVerifyId, setSiteVerifyId] = useState(props.sid)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleInputChange = ({ copyValue }) => {
    setCopyValue({ copyValue, copied })
  }

  const handleHiddenInputChange = (e) => {
    setSiteVerifyId({ value: e.currentTarget.site_verify_id.value })
  }

  const handleInputCopy = () => {
    setCopied(true)
  }

  const handleSiteVerification = useCallback(async (e) => {
    e.preventDefault()

    if (errorMsg) setErrorMsg('')
    if (successMsg) setSuccessMsg('')

    const body = {
      sid: e.currentTarget.site_verify_id.value,
    }

    try {
      fetch('/api/site/' + body.sid + '/verify/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify(body),
      }).then((res) => {
        if (Math.floor(res.status/200) === 1) {
          return res.json()
        }
      }).then((data) => {
        setSuccessMsg('Site verification success')
      })
    } catch(error) {
      console.error('An unexpected error occurred', error)
      setErrorMsg(error.data.message)
    }
  })

  useEffect(() => {
    Router.prefetch('/sites/information')
  })
  
  return (
    <Layout>
      <Head>
        <title>Verify URL</title>
      </Head>

      <SitesVerifyUrlDiv
        className={`h-screen flex overflow-hidden bg-gray-100`}
      >
        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Sidebar */}
        <Sidebar />

        <div className={`flex flex-col w-0 flex-1 overflow-hidden`}>
          <div className={`md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3`}>
            <button
              className={`-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150`}
              aria-label={`Open sidebar`}
            >
              <svg
                className={`h-6 w-5`}
                stroke={`currentColor`}
                fill={`none`}
                viewBox={`0 0 24 24`}
              >
                <path
                  strokeLinecap={`round`}
                  strokeLinejoin={`round`}
                  strokeWidth={`2`}
                  d={`M4 6h16M4 12h16M4 18h16`}
                />
              </svg>
            </button>
          </div>
          <main
            className={`flex-1 relative z-0 overflow-y-auto pt-2 pb-6 focus:outline-none md:py-6`}
            tabIndex={`0`}
          >
            <div className={`max-w-7xl mx-auto px-4 md:py-4 sm:px-6 md:px-8`}>
              <div className={`bg-white overflow-hidden shadow rounded-lg`}>
                <div className={`px-4 pt-4 sm:px-8 sm:pt-8`}>
                  <div className={`max-w-full pt-4 m-auto`}>
                    <h4
                      className={`text-2xl leading-6 font-medium text-gray-900`}
                    >
                      Add a new site
                    </h4>
                    <p
                      className={`max-w-full mt-2 text-sm leading-5 text-gray-500`}
                    >
                      Organically grow the holistic world view of disruptive
                      innovation via workplace diversity and empowerment.
                    </p>
                  </div>
                </div>
                <div
                  className={`max-w-full sm:px-8 sm:pt-6 sm:pb-8 grid gap-16 pt-12 lg:grid-cols-4 lg:col-gap-5 lg:row-gap-12`}
                >
                  <div className={`wizard-indicator bg-green-500`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 text-gray-400`}
                    >
                      1. Register a new URL
                    </p>
                  </div>
                  <div className={`wizard-indicator bg-green-500`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 text-black-600`}
                    >
                      2. Verify the added URL
                    </p>
                  </div>
                  <div className={`wizard-indicator bg-gray-100`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 text-gray-400`}
                    >
                      3. Fill in site information
                    </p>
                  </div>
                  <div className={`wizard-indicator bg-gray-100`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 text-gray-400`}
                    >
                      4. Crawl the site
                    </p>
                  </div>
                </div>

                <div className={`px-4 pt-8 pb-12 sm:px-8`}>
                  <div className={`max-w-6xl py-4 m-auto`}>
                    <div>
                      <h4
                        className={`text-lg leading-7 font-medium text-gray-900`}
                      >
                        Verify the added URL
                      </h4>
                      <p
                        className={`max-w-full text-sm mb-5 leading-5 text-gray-500`}
                      >
                        At the end of the day, going forward, a new normal that
                        has evolved from generation X is on the runway heading
                        towards a streamlined cloud solution.
                      </p>
                      <p
                        className={`max-w-full text-md leading-6 text-gray-700 mb-3`}
                      >
                        Instructions:
                      </p>
                      <ol>
                        <li className={`text-sm leading-6 text-gray-500`}>
                          Sign in to your website.
                        </li>
                        <li className={`text-sm leading-6 text-gray-500`}>
                          Copy the meta tag below and add it within your
                          website's HEAD tag <br />
                          <div>
                            <div className={`my-3 flex`}>
                              <div
                                className={`rounded-md shadow-sm max-w-sm relative flex-grow focus-within:z-10`}
                              >
                                <input
                                  id="email"
                                  className={`form-input block w-full rounded-none rounded-l-md transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
                                  name={`verify_id_meta_tag`}
                                  value={copyValue}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <CopyToClipboard
                                onCopy={handleInputCopy}
                                text={copyValue}
                              >
                                <button
                                  className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-r-md text-gray-700 bg-gray-50 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
                                >
                                  <span>
                                    {copied ? "Copied!" : "Copy to clipboard"}
                                  </span>
                                </button>
                              </CopyToClipboard>
                            </div>
                          </div>
                        </li>
                        <li className={`text-sm leading-6 text-gray-500`}>
                          Press <strong>Verify Site</strong> button below
                        </li>
                      </ol>
                    </div>
                  </div>

                  <div className={`mt-5 mx-auto sm:flex sm:justify-between`}>
                    <div>
                      <form
                        onSubmit={handleSiteVerification}
                        className={`sm:flex sm:items-center`}
                      >
                        <input
                          type="hidden"
                          value={siteVerifyId}
                          name={`site_verify_id`}
                          onChange={handleHiddenInputChange}
                        />
                        <button
                          type={`submit`}
                          className={`mt-3 mr-3 rounded-md shadow sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700`}
                        >
                          Verify Site
                        </button>
                        <Link href="/sites/information">
                          <a
                            type={`button`}
                            className={`mt-3 mr-3 rounded-md shadow sm:mt-0 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150`}
                          >
                            Verify Later
                          </a>
                        </Link>

                        {errorMsg && (
                          <div className={`inline-block p-2`}>
                            <div className={`flex`}>
                              <div>
                                <h3
                                  className={`text-sm leading-5 font-medium text-red-800 break-words`}
                                >
                                  {errorMsg}
                                </h3>
                              </div>
                            </div>
                          </div>
                        )}

                        {successMsg && (
                          <div className={`inline-block p-2`}>
                            <div className={`flex`}>
                              <div>
                                <h3
                                  className={`text-sm leading-5 font-medium text-green-800 break-words`}
                                >
                                  {successMsg}
                                </h3>
                              </div>
                            </div>
                          </div>
                        )}
                      </form>
                    </div>
                    <div>
                      <Link href="/sites/information">
                        <a
                          type={`button`}
                          className={`mt-3 mr-3 rounded-md shadow sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-outline-green focus:border-green-700 active:bg-green-700`}
                        >
                          Proceed to Step 3
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SitesVerifyUrlDiv>
    </Layout>
  );
}

SitesVerifyUrl.getInitialProps = ({ query }) => {
  return {
    sid: query.sid,
    surl: query.surl,
    vid: query.vid,
    v: query.v,
  }
}

export default SitesVerifyUrl

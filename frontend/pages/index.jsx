import { useState } from 'react'
import Head from "next/head"
import Link from "next/link"
import Layout from "components/Layout"
import PropTypes from "prop-types"
import useUser from "hooks/useUser"
import Transition from "hooks/Transition"
import AppLogo from 'components/logo/AppLogo'

const Home = () => {
  const { user } = useUser({ redirectTo: "/dashboard/sites" })
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <Layout>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`relative bg-white overflow-hidden`}>
        <div className={`hidden lg:block lg:absolute lg:inset-0`}>
          <svg
            className={`absolute top-0 h-full left-1/2 transform translate-x-full translate-y-8" width="640" height="784" fill="none" viewBox="0 0 640 784`}
          >
            <defs>
              <pattern
                id={`9ebea6f4-a1f5-4d96-8c4e-4c2abf658047`}
                x={`118`}
                y={`0`}
                width={`20`}
                height={`20`}
                patternUnits={`userSpaceOnUse`}
              >
                <rect
                  x={`0`}
                  y={`0`}
                  width={`4`}
                  height={`4`}
                  className={`text-gray-200`}
                  fill={`currentColor`}
                />
              </pattern>
            </defs>
            <rect
              y={`72`}
              width={`640`}
              height={`640`}
              className={`text-gray-100`}
              fill={`currentColor`}
            />
            <rect
              x={`118`}
              width={`404`}
              height={`784`}
              fill={`url(#9ebea6f4-a1f5-4d96-8c4e-4c2abf658047)`}
            />
          </svg>
        </div>
        <div className={`relative pt-6 pb-16 md:pb-20 lg:pb-24 xl:pb-32`}>
          <nav
            className={`relative max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6`}
          >
            <div className={`flex items-center flex-1`}>
              <div
                className={`flex items-center justify-between w-full md:w-auto`}
              >
                <a href={`#`}>
                  <AppLogo
                    className={`h-8 w-auto sm:h-10`}
                    src={`/img/logos/site-logo.svg`}
                    alt={`app-logo`}
                  />
                </a>
                <div className={`-mr-2 flex items-center md:hidden`}>
                  <button
                    type={`button`}
                    className={`inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out`}
                    onClick={e => setShowMobileMenu(!showMobileMenu)}
                  >
                    <svg
                      className={`h-6 w-6`}
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
              </div>
              <div className={`hidden md:block md:ml-10`}>
                <a
                  href="#"
                  className={`font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition duration-150 ease-in-out`}
                >
                  Product
                </a>
                <a
                  href="#"
                  className={`ml-10 font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition duration-150 ease-in-out`}
                >
                  Features
                </a>
                <a
                  href="#"
                  className={`ml-10 font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition duration-150 ease-in-out`}
                >
                  Marketplace
                </a>
                <a
                  href="#"
                  className={`ml-10 font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition duration-150 ease-in-out`}
                >
                  Company
                </a>
              </div>
            </div>
            <div className={`hidden md:block text-right`}>
              <span className={`inline-flex rounded-md shadow-md`}>
                <span className={`inline-flex rounded-md shadow-xs`}>
                  {user === undefined || !user ? (
                    <Link href="/login">
                      <a
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:shadow-xs-outline transition duration-150 ease-in-out`}
                      >
                        Log in
                      </a>
                    </Link>
                  ) : (
                    <Link href="/dashboard/sites">
                      <a
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:shadow-xs-outline transition duration-150 ease-in-out`}
                      >
                        Go to Sites
                      </a>
                    </Link>
                  )}
                </span>
              </span>
            </div>
          </nav>

          <Transition
            enter="duration-150 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
            show={showMobileMenu}
          >
            <div
              className={`absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden`}
            >
              <div className={`rounded-lg shadow-xs-md`}>
                <div
                  className={`rounded-lg bg-white shadow-xs-xs overflow-hidden`}
                >
                  <div
                    className={`px-5 pt-4 flex items-center justify-between`}
                  >
                    <div>
                      <img
                        className={`h-8 w-auto`}
                        src={`/img/logos/workflow-logo-on-white.svg`}
                        alt={``}
                      />
                    </div>
                    <div className={`-mr-2`}>
                      <button
                        type={`button`}
                        className={`inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out`}
                        onClick={e => setShowMobileMenu(!showMobileMenu)}
                      >
                        <svg
                          className={`h-6 w-6`}
                          stroke={`currentColor`}
                          fill={`none`}
                          viewBox={`0 0 24 24`}
                        >
                          <path
                            strokeLinecap={`round`}
                            strokeLinejoin={`round`}
                            strokeWidth={`2`}
                            d={`M6 18L18 6M6 6l12 12`}
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className={`px-2 pt-2 pb-3`}>
                    <a
                      href="#"
                      className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition duration-150 ease-in-out`}
                    >
                      Product
                    </a>
                    <a
                      href="#"
                      className={`mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition duration-150 ease-in-out`}
                    >
                      Features
                    </a>
                    <a
                      href="#"
                      className={`mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition duration-150 ease-in-out`}
                    >
                      Marketplace
                    </a>
                    <a
                      href="#"
                      className={`mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition duration-150 ease-in-out`}
                    >
                      Company
                    </a>
                  </div>
                  <div>
                    {user === undefined || !user ? (
                      <Link href="/login">
                        <a
                          className={`block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-100 hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:bg-gray-100 focus:text-indigo-700 transition duration-150 ease-in-out`}
                        >
                          Log in
                        </a>
                      </Link>
                    ) : (
                      <Link href="/dashboard/sites">
                        <a
                          className={`block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-100 hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:bg-gray-100 focus:text-indigo-700 transition duration-150 ease-in-out`}
                        >
                          Go to Sites
                        </a>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <div
            className={`mt-8 mx-auto max-w-6xl px-4 sm:mt-12 sm:px-6 md:mt-20 xl:mt-24`}
          >
            <div className={`lg:grid lg:grid-cols-12 lg:gap-8`}>
              <div
                className={`sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left`}
              >
                <div
                  className={`text-sm font-semibold uppercase tracking-wide text-gray-500 sm:text-base lg:text-sm xl:text-base`}
                >
                  Coming soon
                </div>
                <h2
                  className={`mt-1 text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:leading-none sm:text-6xl lg:text-5xl xl:text-6xl`}
                >
                  Data to enrich your&nbsp;
                  <br className={`hidden md:inline`} />
                  <span className={`text-indigo-600`}>online business</span>
                </h2>
                <p
                  className={`mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl`}
                >
                  Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure
                  qui lorem cupidatat commodo. Elit sunt amet fugiat veniam
                  occaecat fugiat aliqua ad ad non deserunt sunt.
                </p>
                <div
                  className={`mt-5 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0`}
                >
                  <p className={`text-base font-medium text-gray-900`}>
                    Sign up to get notified when it’s ready.
                  </p>
                  <form action="#" method={`POST`} className={`mt-5 sm:flex`}>
                    <input
                      aria-label={`Email`}
                      className={`appearance-none block w-full px-3 py-3 border border-gray-300 text-base leading-6 rounded-md placeholder-gray-500 shadow-xs-sm focus:outline-none focus:placeholder-gray-400 focus:shadow-xs-outline focus:border-blue-300 transition duration-150 ease-in-out sm:flex-1`}
                      placeholder={`Enter your email`}
                    />
                    <button
                      type={`submit`}
                      className={`mt-3 w-full px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-800 shadow-xs-sm hover:bg-gray-700 focus:outline-none focus:shadow-xs-outline active:bg-gray-900 transition duration-150 ease-in-out sm:mt-0 sm:ml-3 sm:flex-shrink-0 sm:inline-flex sm:items-center sm:w-auto`}
                    >
                      Notify me
                    </button>
                  </form>
                  <p className={`mt-5 text-sm leading-5 text-gray-500`}>
                    We care about the protection of your data. Read our&nbsp;
                    <a
                      href="#"
                      className={`font-medium text-gray-900 underline`}
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>
              <div
                className={`mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center`}
              >
                <svg
                  className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 scale-75 origin-top sm:scale-100 lg:hidden`}
                  width={`640`}
                  height={`784`}
                  fill={`none`}
                  viewBox={`0 0 640 784`}
                >
                  <defs>
                    <pattern
                      id={`4f4f415c-a0e9-44c2-9601-6ded5a34a13e`}
                      x={`118`}
                      y={`0`}
                      width={`20`}
                      height={`20`}
                      patternUnits={`userSpaceOnUse`}
                    >
                      <rect
                        x={`0`}
                        y={`0`}
                        width={`4`}
                        height={`4`}
                        className={`text-gray-200`}
                        fill={`currentColor`}
                      />
                    </pattern>
                  </defs>
                  <rect
                    y={`72`}
                    width={`640`}
                    height={`640`}
                    className={`text-gray-500`}
                    fill={`currentColor`}
                  />
                  <rect
                    x={`118`}
                    width={`404`}
                    height={`784`}
                    fill={`url(#4f4f415c-a0e9-44c2-9601-6ded5a34a13e`}
                  />
                </svg>
                <div
                  className={`relative mx-auto w-full rounded-lg shadow-xs-lg lg:max-w-md`}
                >
                  <button
                    className={`relative block w-full rounded-lg overflow-hidden focus:outline-none focus:shadow-xs-outline`}
                  >
                    <img
                      className={`w-full`}
                      src={`https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80`}
                      alt={`Woman making a sale`}
                    />
                    <div
                      className={`absolute inset-0 w-full h-full flex items-center justify-center`}
                    >
                      <svg
                        className={`h-20 w-20 text-indigo-500`}
                        fill={`currentColor`}
                        viewBox={`0 0 84 84`}
                      >
                        <circle
                          opacity={`0.9`}
                          cx={`42`}
                          cy={`42`}
                          r={`42`}
                          fill={`white`}
                        />
                        <path
                          d={`M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1275 55.5039 40.3359Z`}
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home

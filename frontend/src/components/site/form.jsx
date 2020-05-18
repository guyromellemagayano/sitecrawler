import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"

const LoginSignupFormDiv = styled.div``

const LoginSignupForm = ({ isLogin, errorMessage, successMessage, onSubmit }) => {
  return (
    <>
      <LoginSignupFormDiv className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md`}>
        {errorMessage && (
          <div className={`rounded-md bg-red-100 p-4 mb-8`}>
            <div className={`flex`}>
              <div className={`flex-shrink-0`}>
                <svg
                  className={`h-5 w-5 text-red-400`}
                  fill={`currentColor`}
                  viewBox={`0 0 20 20`}
                >
                  <path
                    fillRule={`evenodd`}
                    d={`M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z`}
                    clipRule={`evenodd`}
                  />
                </svg>
              </div>
              <div className={`ml-3`}>
                <h3
                  className={`text-sm leading-5 font-medium text-red-800 break-words`}
                >
                  {errorMessage}
                </h3>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className={`rounded-md bg-green-100 p-4 mb-8`}>
            <div className={`flex`}>
              <div className={`flex-shrink-0`}>
                <svg
                  className={`h-5 w-5 text-green-400`}
                  fill={`currentColor`}
                  viewBox={`0 0 20 20`}
                >
                  <path
                    fillRule={`evenodd`}
                    d={`M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z`}
                    clipRule={`evenodd`}
                  />
                </svg>
              </div>
              <div className={`ml-3`}>
                <h3
                  className={`text-sm leading-5 font-medium text-green-800 break-words`}
                >
                  {successMessage}
                </h3>
              </div>
            </div>
          </div>
        )}

        <div className={`bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10`}>
          <form
            onSubmit={onSubmit}
            noValidate
          >
            <div className={`mt-1`}>
              <label
                htmlFor={`username`}
                className={`block text-sm font-medium leading-5 text-gray-700`}
              >
                Username
              </label>
              <div className={`mt-1 rounded-md shadow-sm`}>
                <input
                  id={`username`}
                  type={`text`}
                  name={`username`}
                  required
                  className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
                />
              </div>
            </div>

            <div className={`mt-6`}>
              <label
                htmlFor={`email`}
                className={`block text-sm font-medium leading-5 text-gray-700`}
              >
                Email address
              </label>
              <div className={`mt-1 rounded-md shadow-sm`}>
                <input
                  id={`email`}
                  type={`email`}
                  name={`email`}
                  required
                  className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
                />
              </div>
            </div>

            <div className={`mt-6`}>
              <label
                htmlFor={`password`}
                className={`block text-sm font-medium leading-5 text-gray-700`}
              >
                Password
              </label>
              <div className={`mt-1 rounded-md shadow-sm`}>
                <input
                  id={`password1`}
                  type={`password`}
                  name={`password1`}
                  required
                  className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div className={`mt-6`}>
                  <label
                    htmlFor={`password`}
                    className={`block text-sm font-medium leading-5 text-gray-700`}
                  >
                    Repeat Password
                  </label>
                  <div className={`mt-1 rounded-md shadow-sm`}>
                    <input
                      id={`password2`}
                      type={`password`}
                      name={`password2`}
                      required
                      className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
                    />
                  </div>
                </div>
              </>
            )}

            {isLogin && (
              <div className={`mt-6 flex items-center justify-between`}>
                <div className={`flex items-center`}>
                  <input
                    id={`remember_me`}
                    type={`checkbox`}
                    className={`form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out`}
                  />
                  <label
                    htmlFor={`remember_me`}
                    className={`ml-2 block text-sm leading-5 text-gray-900`}
                  >
                    Remember me
                  </label>
                </div>

                <div className={`text-sm leading-5`}>
                  <a
                    href={`/reset-password`}
                    className={`font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150`}
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}

            <div className={`mt-6`}>
              <span className={`block w-full rounded-md shadow-sm`}>
                {isLogin ? (
                  <button
                    type={`submit`}
                    className={`w-full flex justify-center mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out`}
                  >
                    Sign In
                  </button>
                ) : (
                    <button
                      type={`submit`}
                      className={`w-full flex justify-center mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out`}
                    >
                      Create Account
                    </button>
                  )}
              </span>
            </div>
          </form>

          {!isLogin && (
            <div className="mt-6">
              <div className="relative">
                <div className="relative flex justify-center wrap flex-row text-sm leading-5">
                  <span className="px-2 bg-white text-gray-500 text-center">
                    By signing up, you agree to the&nbsp;
                    <a
                      href="/service-terms"
                      className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                    >
                      Terms of Service
                    </a>
                  &nbsp;and&nbsp;
                    <a
                      href="/privacy-policy"
                      className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </div>
              </div>
            </div>
          )}

          {isLogin && (
            <div className={`mt-6`}>
              <div className={`relative`}>
                <div className={`absolute inset-0 flex items-center`}>
                  <div className={`w-full border-t border-gray-300`}></div>
                </div>
                <div className={`relative flex justify-center text-sm leading-5`}>
                  <span className={`px-2 bg-white text-gray-500`}>
                    Or continue with
              </span>
                </div>
              </div>

              <div className={`mt-6 grid grid-cols-3 gap-3`}>
                <div>
                  <span className={`w-full inline-flex rounded-md shadow-sm`}>
                    <a
                      href={`/auth/google/login/`}
                      type={`button`}
                      className={`w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150 ease-in-out`}
                      aria-label={`Sign in with Google`}
                    >
                      <FontAwesomeIcon
                        icon={["fab", "google"]}
                        className={`h-5 h-5`}
                      />
                    </a>
                  </span>
                </div>

                <div>
                  <span className={`w-full inline-flex rounded-md shadow-sm`}>
                    <Link href={`#`}>
                      <a
                        type={`button`}
                        className={`w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150 ease-in-out`}
                        aria-label={`Sign in with Facebook`}
                      >
                        <FontAwesomeIcon
                          icon={["fab", "facebook-f"]}
                          className={`h-5 h-5`}
                        />
                      </a>
                    </Link>
                  </span>
                </div>

                <div>
                  <span className={`w-full inline-flex rounded-md shadow-sm`}>
                    <Link href={`#`}>
                      <a
                        type={`button`}
                        className={`w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150 ease-in-out`}
                        aria-label={`Sign in with LinkedIn`}
                      >
                        <FontAwesomeIcon
                          icon={["fab", "linkedin-in"]}
                          className={`h-5 h-5`}
                        />
                      </a>
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative flex justify-center wrap flex-row text-sm leading-5">
          <span className="px-2 py-5 text-gray-500">
            {isLogin ? (
              <>
                Don't have an account? &nbsp;
                <Link href="/registration">
                  <a className={`font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150`}>
                    Create Account
                  </a>
                </Link>
              </>
            ) : (
                <>
                  Already have an account? &nbsp;
                  <Link href="/login">
                    <a className={`font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150`}>
                      Log In
                    </a>
                  </Link>
                </>
              )}
          </span>
        </div>
      </LoginSignupFormDiv>
    </>
  )
}

export default LoginSignupForm

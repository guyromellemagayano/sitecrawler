import { Fragment, useEffect, useState } from "react";
import Cookies from "js-cookie";
import Router from "next/router";
import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import useUser from "hooks/useUser";
import Layout from "components/Layout";
import LogoLabel from "components/form/LogoLabel";
import { useRouter } from "next/router";
import SiteHead from 'components/layout/SiteHead'
import AppLogo from 'components/logo/AppLogo'
import SiteFooter from "components/footer/SiteFooter";

const LoginDiv = styled.div``;

const Login = () => {
  const { query } = useRouter();

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorUsernameMsg, setErrorUsernameMsg] = useState("");
  const [errorPasswordMsg, setErrorPasswordMsg] = useState("");
  const [disableLoginForm, setDisableLoginForm] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/dashboard/sites");
  const pageTitle = "Login";

  const { mutateUser } = useUser({
    redirectTo: redirectTo,
    redirectIfFound: true,
  });

  useEffect(() => {
    if (Cookies.get("errLogin")) {
      setErrorMsg(Cookies.get("errLogin"));
      Cookies.remove("errLogin");
    }

    if (query.redirect !== undefined) setRedirectTo(query.redirect);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errorMsg) setErrorMsg("");
    if (successMsg) setSuccessMsg("");

    const body = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch("/api/auth/login/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
        body: JSON.stringify(body),
      });

      if (Math.floor(response.status / 200) === 1) {
        setDisableLoginForm(!disableLoginForm);
        setSuccessMsg("Login Success! Redirecting you to Sites Dashboard");

        setTimeout(async () => {
          const data = await response.json();

          mutateUser(data);
        }, 1500);
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        console.error(error.request);
      } else {
        let msg = JSON.parse(error.message);

        if (msg.username) {
          setErrorUsernameMsg(msg.username[0]);
        }

        if (msg.password) {
          setErrorPasswordMsg(msg.password[0]);
        }

        if (!msg.username && !msg.password && msg.non_field_errors) {
          setErrorMsg(msg.non_field_errors);
        }
      }
    }
  };

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <SiteHead />
      </Head>

      <LoginDiv
        className={`bg-gray-100 min-h-screen`}
      >
        <div className={`relative overflow-auto`}>
          <div className={`relative pt-6 pb-12 md:pb-6`}>
            <main className={`mt-8 sm:mt-16 md:mt-20 lg:mt-24`}>
              <div className={`mx-auto max-w-screen-xl`}>
                <div className={`lg:grid lg:grid-cols-12 lg:gap-8`}>
                  <div className={`px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left lg:flex lg:items-center`}>
                    <div>
                      <AppLogo
                        className={`h-12 w-auto mx-auto mb-16 md:mx-auto lg:mx-0`}
                        src={`/img/logos/site-logo-dark.svg`}
                        alt={`app-logo`}
                      />
                      <h4 className={`mt-4 text-4xl tracking-tight text-center lg:text-left leading-10 font-bold text-gray-900 sm:mt-5 sm:leading-none text-4xl`}>
                        Find website issues before your clients do.
                        <br className={`hidden md:inline`} />
                      </h4>
                      <span className={`inline-flex rounded-md shadow-sm mt-6`}>
                        <button type="button" className={`inline-flex justify-center mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-xs-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out`}>
                        Try for free
                        </button>
                      </span>
                  </div>
                </div>
                <div className={`mt-12 sm:mt-16 lg:mt-0 lg:col-span-5`}>
                  {!disableLoginForm ? <LogoLabel isLogin /> : null}
                  <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md`}>
                    {errorMsg && (
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
                              {errorMsg}
                            </h3>
                          </div>
                        </div>
                      </div>
                    )}

                    {successMsg && (
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
                              {successMsg}
                            </h3>
                          </div>
                        </div>
                      </div>
                    )}

                    {!disableLoginForm && (
                      <Fragment>
                        <div
                          className={`bg-white py-8 px-4 rounded-lg sm:px-10 shadow-xl border border-gray-200`}
                        >
                          <form onSubmit={handleSubmit}>
                            <div className={`mt-1`}>
                              <label
                                htmlFor={`username`}
                                className={`block text-sm font-medium leading-5 text-gray-700`}
                              >
                                Username/Email
                                </label>
                              <div className={`mt-1 rounded-md shadow-xs-sm`}>
                                <input
                                  id={`username`}
                                  type={`text`}
                                  name={`username`}
                                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
                                    errorUsernameMsg
                                      ? "border-red-300"
                                      : "border-gray-300"
                                    }`}
                                  aria-describedby={`username`}
                                  onChange={(e) => setUsername(e.target.value)}
                                />
                              </div>
                              <span
                                className={`block mt-2 text-sm leading-5 text-red-700`}
                              >
                                {errorUsernameMsg}
                              </span>
                            </div>

                            <div className={`mt-6`}>
                              <label
                                htmlFor={`password`}
                                className={`block text-sm font-medium leading-5 text-gray-700`}
                              >
                                Password
                                </label>
                              <div className={`mt-1 rounded-md shadow-xs-sm`}>
                                <input
                                  id={`password`}
                                  type={`password`}
                                  name={`password`}
                                  className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
                                    errorPasswordMsg
                                      ? "border-red-300"
                                      : "border-gray-300"
                                    }`}
                                  aria-describedby={`password`}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                              </div>
                              <span
                                className={`block mt-2 text-sm leading-5 text-red-700`}
                              >
                                {errorPasswordMsg}
                              </span>
                            </div>

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
                                <Link href="/reset-password">
                                  <a
                                    className={`font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150`}
                                  >
                                    Forgot your password?
                                    </a>
                                </Link>
                              </div>
                            </div>

                            <div className={`mt-6`}>
                              <span className={`block w-full rounded-md shadow-xs-sm`}>
                                <button
                                  type={`submit`}
                                  className={`w-full flex justify-center mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-xs-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out`}
                                >
                                  Sign In
                                  </button>
                              </span>
                            </div>
                          </form>

                          <div className={`mt-6`}>
                            <div className={`relative`}>
                              <div className={`absolute inset-0 flex items-center`}>
                                <div className={`w-full border-t border-gray-300`}></div>
                              </div>
                              <div
                                className={`relative flex justify-center text-sm leading-5`}
                              >
                                <span className={`px-2 bg-white text-gray-600`}>
                                  Or continue with
                                  </span>
                              </div>
                            </div>

                            <div className={`mt-6 grid grid-cols-3 gap-3`}>
                              <div>
                                <span
                                  className={`w-full inline-flex rounded-md shadow-xs-sm`}
                                >
                                  <a
                                    href={`/auth/google/login/`}
                                    type={`button`}
                                    className={`w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm leading-5 font-medium text-gray-600 hover:text-gray-400 focus:outline-none focus:border-blue-300 focus:shadow-xs-outline-blue transition duration-150 ease-in-out`}
                                    aria-label={`Sign in with Google`}
                                  >
                                    <FontAwesomeIcon
                                      icon={["fab", "google"]}
                                      className={`h-4 h-4`}
                                    />
                                  </a>
                                </span>
                              </div>

                              <div>
                                <span
                                  className={`w-full inline-flex rounded-md shadow-xs-sm`}
                                >
                                  <Link href="#">
                                    <a
                                      type={`button`}
                                      disabled={`disabled`}
                                      className={`w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm leading-5 font-medium text-gray-600 transition duration-150 ease-in-out opacity-50 cursor-not-allowed`}
                                      aria-label={`Sign in with Facebook`}
                                    >
                                      <FontAwesomeIcon
                                        icon={["fab", "facebook-f"]}
                                        className={`h-4 h-4`}
                                      />
                                    </a>
                                  </Link>
                                </span>
                              </div>

                              <div>
                                <span
                                  className={`w-full inline-flex rounded-md shadow-xs-sm`}
                                >
                                  <Link href="#">
                                    <a
                                      type={`button`}
                                      disabled={`disabled`}
                                      className={`w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm leading-5 font-medium text-gray-600 transition duration-150 ease-in-out opacity-50 cursor-not-allowed`}
                                      aria-label={`Sign in with LinkedIn`}
                                    >
                                      <FontAwesomeIcon
                                        icon={["fab", "linkedin-in"]}
                                        className={`h-4 h-4`}
                                      />
                                    </a>
                                  </Link>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`relative flex justify-center wrap flex-row text-sm leading-5`}
                        >
                          <span className={`px-2 py-5 text-gray-600`}>
                            Don't have an account?&nbsp;
                              <Link href="/registration">
                              <a
                                className={`font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150`}
                              >
                                Create Account
                                </a>
                            </Link>
                          </span>
                        </div>
                      </Fragment>
                    )}
                  </div>
                </div>
              </div>

              <div className={`px-4 xl:px-10 xl:mt-32`}>
                <SiteFooter />
              </div>
              </div>
            </main>
        </div>
        </div>
      </LoginDiv>
    </Layout >
  );
};

export default Login;

Login.propTypes = {
  errorMsg: PropTypes.string,
  successMsg: PropTypes.string,
  handleSubmit: PropTypes.func,
};

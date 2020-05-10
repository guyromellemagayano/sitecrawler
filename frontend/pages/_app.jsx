/* eslint-disable react/jsx-props-no-spreading */

import NextApp from "next/app"
import Router from "next/router"
import Layout from "components/layout"
import ReactGA from "react-ga"
import { NextSEO } from "next-seo"
import Progress from "nprogress"
import config from "public/static/config.json"
import { register, unregister } from "next-offline/runtime"

// import "public/static/styles/_variable.scss"

if (config.enableGoogleAnalytics) {
  ReactGA.initialize(process.env.GA_TRACKING_NUMBER || "number")
}

if (config.enablePageLoadingBar) {
  Progress.configure({
    trickleSpeed: 100,
    showSpinner: false,
  });

  Router.events.on("routeChangeStart", () => {
    Progress.start()
  })

  Router.events.on("routeChangeComplete", () => {
    Progress.done()
  })

  Router.events.on("routeChangeError", () => {
    Progress.done()
  })
}

class App extends NextApp {
  componentDidMount() {
    register();

    if (config.enableGoogleAnalytics) {
      this.logPageView(window.location.pathname + window.location.search);
      Router.onRouteChangeComplete = (url) => {
        this.logPageView(url);
      };
    }
  }

  componentWillUnmount() {
    unregister();
  }

  logPageView = () => {
    try {
      ReactGA.set({ page: url })
      ReactGA.pageview(url)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  render() {
    const { PureComponent, pageProps } = this.props;

    return [
      <NextSEO
        key="seo"
        openGraph={{
          site_name: strings.name,
        }}
      />,
      <Layout key="layout">
        <PureComponent {...pageProps} />
      </Layout>
    ]
  }
}

export default App
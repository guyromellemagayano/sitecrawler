// NextJS
import Router from "next/router";

// External
import "nprogress/nprogress.css";
import NProgress from "nprogress";

const TopProgressBar = () => {
	let state;
	let activeRequests = 0;

	NProgress.configure({ showSpinner: false });

	const load = () => {
		if (state === "loading") {
			return;
		}

		state = "loading";

		NProgress.start();
	};

	const stop = () => {
		if (activeRequests > 0) {
			return;
		}

		state = "stop";

		NProgress.done();
	};

	Router.events.on("routeChangeStart", load);
	Router.events.on("routeChangeComplete", stop);
	Router.events.on("routeChangeError", stop);

	if (typeof window !== "undefined") {
		const originalFetch = window.fetch;

		window.fetch = async function (...args) {
			if (activeRequests === 0) {
				load();
			}

			activeRequests++;

			try {
				const response = await originalFetch(...args);
				return response;
			} catch (error) {
				return Promise.reject(error);
			} finally {
				activeRequests -= 1;
				if (activeRequests === 0) {
					stop();
				}
			}
		};
	}

	return null;
};

export default TopProgressBar;

// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import "nprogress/nprogress.css";
import NProgress from "nprogress";

const TopProgressBar = () => {
	let state;
	let activeRequests = 0;

	const router = useRouter();
	NProgress.configure({ showSpinner: false });

	React.useEffect(() => {
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

		router.events.on("routeChangeStart", load);
		router.events.on("routeChangeComplete", stop);
		router.events.on("routeChangeError", stop);

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

		return () => {
			router.events.off("routeChangeStart", load);
		};
	}, []);

	return null;
};

export default TopProgressBar;

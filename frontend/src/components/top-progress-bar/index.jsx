import { useNProgress } from "@tanem/react-nprogress";
import { useRouter } from "next/router";
import * as React from "react";

const TopProgressBar = () => {
	const [state, setState] = React.useState({
		isRouteChanging: false
	});

	let activeRequests = 0;

	const router = useRouter();

	React.useEffect(() => {
		const handleRouteChangeStart = () => {
			setState((prevState) => ({
				...prevState,
				isRouteChanging: true
			}));
		};

		const handleRouteChangeEnd = () => {
			if (activeRequests > 0) {
				return;
			}

			setState((prevState) => ({
				...prevState,
				isRouteChanging: false
			}));
		};

		router.events.on("routeChangeStart", handleRouteChangeStart);
		router.events.on("routeChangeComplete", handleRouteChangeEnd);
		router.events.on("routeChangeError", handleRouteChangeEnd);

		typeof window !== "undefined" &&
			(() => {
				const originalFetch = window.fetch;

				window.fetch = async function (...args) {
					if (activeRequests === 0) {
						handleRouteChangeStart();
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
							handleRouteChangeEnd();
						}
					}
				};
			})();

		return () => {
			router.events.off("routeChangeStart", handleRouteChangeStart);
			router.events.off("routeChangeComplete", handleRouteChangeEnd);
			router.events.off("routeChangeError", handleRouteChangeEnd);
		};
	}, [router.events]);

	const { animationDuration, isFinished, progress } = useNProgress({
		isAnimating: state.isRouteChanging
	});

	return (
		<>
			<style jsx>{`
				.container {
					opacity: ${isFinished ? 0 : 1};
					pointer-events: none;
					transition: opacity ${animationDuration}ms linear;
				}

				.bar {
					background: #29d;
					height: 2px;
					left: 0;
					margin-left: ${(-1 + progress) * 100} + "%";
					position: fixed;
					top: 0;
					transition: margin-left ${animationDuration}ms linear;
					width: 100%;
					z-index: 1031;
				}

				.spinner {
					box-shadow: 0 0 10px #29d, 0 0 5px #29d;
					display: block;
					height: 100%;
					opacity: 1;
					position: absolute;
					right: 0;
					transform: rotate(3deg) translate(0px, -4px);
					width: 100px;
				}
			`}</style>

			<div className="container">
				<div className="bar">
					<div className="spinner" />
				</div>
			</div>
		</>
	);
};

export default TopProgressBar;

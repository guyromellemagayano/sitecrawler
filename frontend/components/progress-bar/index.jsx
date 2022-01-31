import { useNProgress } from "@tanem/react-nprogress";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import tw, { css } from "twin.macro";

/**
 * Custom function to render the `ProgressBar` component
 */
const ProgressBar = () => {
	const [state, setState] = useState({
		isRouteChanging: false
	});

	let activeRequests = 0;

	// Router
	const router = useRouter();

	useEffect(() => {
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

		return () => {
			router.events.off("routeChangeStart", handleRouteChangeStart);
			router.events.off("routeChangeComplete", handleRouteChangeEnd);
			router.events.off("routeChangeError", handleRouteChangeEnd);

			setState((prevState) => ({
				...prevState,
				isRouteChanging: false
			}));
		};
	}, [router]);

	const { animationDuration, isFinished, progress } = useNProgress({
		isAnimating: state.isRouteChanging
	});

	return (
		<div
			css={[
				tw`fixed top-0 left-0 w-full h-0.5 z-50 bg-red-400 ease-linear pointer-events-none transition-opacity`,
				css`
					margin-left: ${(-1 + progress) * 100} + "%";
					transition-property: margin-left;
				`,
				animationDuration
					? css`
							transition-delay: ${animationDuration}ms;
					  `
					: null,
				isFinished ? tw`opacity-0` : tw`opacity-100`
			]}
		>
			<div
				css={[
					tw`block h-full opacity-100 absolute right-0 transform-gpu rotate-3 translate-x-0 -translate-y-1`,
					css`
						width: 100px;
						box-shadow: 0 0 10px ${tw`bg-red-400`}, 0 0 5px ${tw`bg-red-400`};
					`
				]}
			/>
		</div>
	);
};

export default ProgressBar;

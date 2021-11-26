import { MobileSidebarButton } from "@components/buttons/MobileSidebarButton";
import AppSeo from "@configs/AppSeo";
import { OnErrorRetryCount, RevalidationInterval } from "@configs/GlobalValues";
import { DashboardSitesLink, DashboardSlug, LoginLink } from "@configs/PageLinks";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useGetMethod } from "@hooks/useHttpMethod";
import * as Sentry from "@sentry/nextjs";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { DefaultSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { SWRConfig } from "swr";
import "twin.macro";

// Font Awesome
library.add(fab);
library.add(fas);

/**
 * Dynamic imports
 */
const GlobalStyles = dynamic(() => import("@styles/GlobalStyles"), { ssr: true });
const TopProgressBar = dynamic(() => import("@components/top-progress-bar"), { ssr: true });
const Alert = dynamic(() => import("@components/alerts"), { ssr: true });
const Sidebar = dynamic(() => import("@components/layouts/components/Sidebar"), { ssr: true });
const AddSite = dynamic(() => import("@components/sites/AddSite"), { ssr: true });

const Layout = ({ children }) => {
	// Router
	const { asPath } = useRouter();
	const { pathname } = useRouter();
	const router = useRouter();

	// Custom hooks
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	useEffect(() => {
		// Prefetch sites page for faster loading
		router.prefetch(DashboardSitesLink);
		router.prefetch(LoginLink);

		// LogRocket setup
		if (process.env.NODE_ENV === "production") {
			LogRocket.init("epic-design-labs/link-app");
			setupLogRocketReact(LogRocket);
		}
	}, []);

	return (
		<SWRConfig
			value={{
				fetcher: useGetMethod,
				refreshInterval: RevalidationInterval,
				onErrorRetry: (err, key, config, revalidate, { retryCount }) => {
					// Capture unknown errors and send to Sentry
					Sentry.configureScope((scope) => {
						scope.setTag("action", "onErrorRetry");
						scope.setTag("route", asPath);
						scope.setTag("key", key);
						scope.setTag("config", config);
						Sentry.captureException(new Error(err));
					});

					// Only retry up to 5 times.
					if (retryCount >= OnErrorRetryCount) return;

					// Retry after 5 seconds.
					setTimeout(() => revalidate({ retryCount }), RevalidationInterval);
				}
			}}
		>
			<GlobalStyles />
			<DefaultSeo {...AppSeo} />
			<TopProgressBar />
			<Sentry.ErrorBoundary
				fallback={({ error, componentStack }) => {
					// Translations
					const { t } = useTranslation("alerts");
					const fallbackUnknownError = t("fallbackUnknownError", {
						message: error.toString(),
						component: componentStack
					});

					return <Alert message={fallbackUnknownError} isError />;
				}}
			>
				<main tw="h-screen">
					{pathname.includes(DashboardSlug) ? (
						<section tw="h-screen overflow-hidden bg-gray-50 flex">
							<Sidebar ref={ref} openSidebar={isComponentVisible} setOpenSidebar={setIsComponentVisible} />

							<div tw="flex flex-col w-0 flex-1 overflow-hidden min-h-screen">
								<div tw="relative flex-shrink-0 flex">
									<div tw="border-b flex-shrink-0 flex">
										<MobileSidebarButton openSidebar={isComponentVisible} setOpenSidebar={setIsComponentVisible} />
									</div>

									{/* <AddSite /> */}
								</div>

								<Scrollbars universal>
									<div tw="absolute w-full h-full max-w-screen-2xl mx-auto left-0 right-0">
										<div tw="flex flex-col h-full">{children}</div>
									</div>
								</Scrollbars>
							</div>
						</section>
					) : (
						children
					)}
				</main>
			</Sentry.ErrorBoundary>
		</SWRConfig>
	);
};

Layout.propTypes = {
	children: PropTypes.any
};

export default Layout;

/* eslint-disable react-hooks/exhaustive-deps */
import { MemoizedProgressBar } from "@components/progress-bar";
import {
	CurrentSubscriptionApiEndpoint,
	DefaultPaymentMethodApiEndpoint,
	PaymentMethodApiEndpoint,
	SitesApiEndpoint,
	StripePromiseApiEndpoint,
	SubscriptionsApiEndpoint,
	UserApiEndpoint
} from "@constants/ApiEndpoints";
import AppSeo from "@constants/AppSeo";
import { ComponentReadyInterval, NoInterval, RevalidationInterval } from "@constants/GlobalValues";
import {
	DashboardSlug,
	ScanSlug,
	SiteImageSlug,
	SiteLinkSlug,
	SitePageSlug,
	SummarySlug,
	UptimeSlug
} from "@constants/PageLinks";
import { isProd } from "@constants/ServerEnv";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useCurrentSubscription } from "@hooks/useCurrentSubscription";
import { useDefaultPaymentMethod } from "@hooks/useDefaultPaymentMethod";
import { useImageId } from "@hooks/useImageId";
import { useImages } from "@hooks/useImages";
import { useLinkId } from "@hooks/useLinkId";
import { useLinks } from "@hooks/useLinks";
import { useNotificationMessage } from "@hooks/useNotificationMessage";
import { usePageId } from "@hooks/usePageId";
import { usePages } from "@hooks/usePages";
import { usePaymentMethods } from "@hooks/usePaymentMethods";
import { useScan } from "@hooks/useScan";
import { useSiteId } from "@hooks/useSiteId";
import { useSites } from "@hooks/useSites";
import { useStats } from "@hooks/useStats";
import { useStripePromise } from "@hooks/useStripePromise";
import { useSubscriptions } from "@hooks/useSubscriptions";
import { useUptime } from "@hooks/useUptime";
import { useUptimeSummary } from "@hooks/useUptimeSummary";
import { useUser } from "@hooks/useUser";
import "@styles/tailwind.css";
import { handleConversionStringToNumber } from "@utils/convertCase";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import { createContext, useEffect, useReducer } from "react";

// Font Awesome
library.add(fab);
library.add(fas);
library.add(far);

export const SiteCrawlerAppContext = createContext();

// App initial states
const initialState = {
	isComponentReady: false,
	customUserApiEndpoint: null,
	customSitesApiEndpoint: null,
	customStatsApiEndpoint: null,
	customStripePromiseApiEndpoint: null,
	customPaymentMethodsApiEndpoint: null,
	customDefaultPaymentMethodApiEndpoint: null,
	customSubscriptionsApiEndpoint: null,
	customCurrentSubscriptionApiEndpoint: null,
	customSitesIdApiEndpoint: null,
	customUptimeApiEndpoint: null,
	customUptimeSummaryApiEndpoint: null,
	customScanApiEndpoint: null,
	customLinksApiEndpoint: null,
	customLinksIdApiEndpoint: null,
	customPagesApiEndpoint: null,
	customPagesIdApiEndpoint: null,
	customImagesApiEndpoint: null,
	customImagesIdApiEndpoint: null,
	hasSiteLimitReached: false,
	isUserForbidden: true
};

// App reducer
const reducer = (state, action) => {
	switch (action.type) {
		case "SET_COMPONENT_READY":
			return {
				...state,
				isComponentReady: action.payload
			};
		case "SET_CUSTOM_USER_API_ENDPOINT":
			return {
				...state,
				customUserApiEndpoint: action.payload
			};
		case "SET_CUSTOM_SITES_API_ENDPOINT":
			return {
				...state,
				customSitesApiEndpoint: action.payload
			};
		case "SET_CUSTOM_STATS_API_ENDPOINT":
			return {
				...state,
				customStatsApiEndpoint: action.payload
			};
		case "SET_CUSTOM_STRIPE_PROMISE_API_ENDPOINT":
			return {
				...state,
				customStripePromiseApiEndpoint: action.payload
			};
		case "SET_CUSTOM_PAYMENT_METHODS_API_ENDPOINT":
			return {
				...state,
				customPaymentMethodsApiEndpoint: action.payload
			};
		case "SET_CUSTOM_DEFAULT_PAYMENT_METHOD_API_ENDPOINT":
			return {
				...state,
				customDefaultPaymentMethodApiEndpoint: action.payload
			};
		case "SET_CUSTOM_SUBSCRIPTIONS_API_ENDPOINT":
			return {
				...state,
				customSubscriptionsApiEndpoint: action.payload
			};
		case "SET_CUSTOM_CURRENT_SUBSCRIPTION_API_ENDPOINT":
			return {
				...state,
				customCurrentSubscriptionApiEndpoint: action.payload
			};
		case "SET_CUSTOM_SITES_ID_API_ENDPOINT":
			return {
				...state,
				customSitesIdApiEndpoint: action.payload
			};
		case "SET_CUSTOM_UPTIME_API_ENDPOINT":
			return {
				...state,
				customUptimeApiEndpoint: action.payload
			};
		case "SET_CUSTOM_UPTIME_SUMMARY_API_ENDPOINT":
			return {
				...state,
				customUptimeSummaryApiEndpoint: action.payload
			};
		case "SET_CUSTOM_SCAN_API_ENDPOINT":
			return {
				...state,
				customScanApiEndpoint: action.payload
			};
		case "SET_CUSTOM_LINKS_API_ENDPOINT":
			return {
				...state,
				customLinksApiEndpoint: action.payload
			};
		case "SET_CUSTOM_LINKS_ID_API_ENDPOINT":
			return {
				...state,
				customLinksIdApiEndpoint: action.payload
			};
		case "SET_CUSTOM_PAGES_API_ENDPOINT":
			return {
				...state,
				customPagesApiEndpoint: action.payload
			};
		case "SET_CUSTOM_PAGES_ID_API_ENDPOINT":
			return {
				...state,
				customPagesIdApiEndpoint: action.payload
			};
		case "SET_CUSTOM_IMAGES_API_ENDPOINT":
			return {
				...state,
				customImagesApiEndpoint: action.payload
			};
		case "SET_CUSTOM_IMAGES_ID_API_ENDPOINT":
			return {
				...state,
				customImagesIdApiEndpoint: action.payload
			};
		case "SET_HAS_SITE_LIMIT_REACHED":
			return {
				...state,
				hasSiteLimitReached: action.payload
			};
		case "SET_IS_USER_FORBIDDEN":
			return {
				...state,
				isUserForbidden: action.payload
			};
		default:
			return state;
	}
};

export default function SiteCrawlerApp({ Component, pageProps, err }) {
	const [state, dispatch] = useReducer(reducer, initialState);

	// Router
	const { isReady, query, asPath } = useRouter();

	// Query values
	const querySiteId = query.siteId ? handleConversionStringToNumber(query.siteId) : null;
	const queryLinkId = query.linkId ? handleConversionStringToNumber(query.linkId) : null;
	const queryPageId = query.pageId ? handleConversionStringToNumber(query.pageId) : null;
	const queryImageId = query.imageId ? handleConversionStringToNumber(query.imageId) : null;

	// Custom hooks
	const { state: notificationMessageState, setConfig } = useNotificationMessage();

	useEffect(() => {
		// LogRocket setup
		if (isProd) {
			LogRocket.init(process.env.LOGROCKET_APP_ID);
			setupLogRocketReact(LogRocket);
		}
	}, []);

	useEffect(() => {
		if (isReady) {
			setTimeout(() => dispatch({ type: "SET_COMPONENT_READY", payload: true }), ComponentReadyInterval);
		} else {
			dispatch({ type: "SET_COMPONENT_READY", payload: false });
		}
	}, [isReady]);

	useEffect(() => {
		// Custom API endpoint states that rely on `user` value
		if (state.isComponentReady && asPath.includes(DashboardSlug)) {
			dispatch({ type: "SET_CUSTOM_USER_API_ENDPOINT", payload: UserApiEndpoint });
			dispatch({ type: "SET_CUSTOM_SITES_API_ENDPOINT", payload: SitesApiEndpoint });
			dispatch({ type: "SET_CUSTOM_STRIPE_PROMISE_API_ENDPOINT", payload: StripePromiseApiEndpoint });
			dispatch({ type: "SET_CUSTOM_PAYMENT_METHODS_API_ENDPOINT", payload: PaymentMethodApiEndpoint });
			dispatch({ type: "SET_CUSTOM_DEFAULT_PAYMENT_METHOD_API_ENDPOINT", payload: DefaultPaymentMethodApiEndpoint });
			dispatch({ type: "SET_CUSTOM_SUBSCRIPTIONS_API_ENDPOINT", payload: SubscriptionsApiEndpoint });
			dispatch({ type: "SET_CUSTOM_CURRENT_SUBSCRIPTION_API_ENDPOINT", payload: CurrentSubscriptionApiEndpoint });
		} else {
			dispatch({ type: "SET_CUSTOM_USER_API_ENDPOINT", payload: null });
			dispatch({ type: "SET_CUSTOM_SITES_API_ENDPOINT", payload: null });
			dispatch({ type: "SET_CUSTOM_PAYMENT_METHODS_API_ENDPOINT", payload: null });
			dispatch({ type: "SET_CUSTOM_DEFAULT_PAYMENT_METHOD_API_ENDPOINT", payload: null });
			dispatch({ type: "SET_CUSTOM_SUBSCRIPTIONS_API_ENDPOINT", payload: null });
			dispatch({ type: "SET_CUSTOM_CURRENT_SUBSCRIPTION_API_ENDPOINT", payload: null });
		}
	}, [asPath, state.isComponentReady]);

	// `user` SWR hook
	const { user } = useUser(state.customUserApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data).length > 0 && !e.data.detail
				? NoInterval
				: RevalidationInterval
	});

	// `stripePromise` SWR hook
	const { stripePromise } = useStripePromise(state.customStripePromiseApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data).length > 0 && !e.data.detail
				? NoInterval
				: RevalidationInterval
	});

	// `paymentMethods` SWR hook
	const { paymentMethods } = usePaymentMethods(state.customPaymentMethodsApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data).length > 0 && !e.data.detail
				? NoInterval
				: RevalidationInterval
	});

	// `defaultPaymentMethod` SWR hook
	const { defaultPaymentMethod } = useDefaultPaymentMethod(state.customDefaultPaymentMethodApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data)?.length > 0 && !e.data?.detail
				? NoInterval
				: RevalidationInterval
	});

	// `subscriptions` SWR hook
	const { subscriptions } = useSubscriptions(state.customSubscriptionsApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data).length > 0 && !e.data.detail
				? NoInterval
				: RevalidationInterval
	});

	// `currentSubscription` SWR hook
	const { currentSubscription } = useCurrentSubscription(state.customCurrentSubscriptionApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data).length > 0 && !e.data.detail
				? NoInterval
				: RevalidationInterval
	});

	// `sites` SWR hook
	const { sites } = useSites(state.customSitesApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data).length > 0 && !e.data.detail
				? NoInterval
				: RevalidationInterval
	});

	// Custom `siteId` SWR hook
	useEffect(() => {
		if (
			sites &&
			sites.data &&
			Object.keys(sites.data).length > 0 &&
			state.customSitesApiEndpoint.length > 0 &&
			querySiteId
		) {
			dispatch({ type: "SET_CUSTOM_SITES_ID_API_ENDPOINT", payload: querySiteId });
		} else {
			dispatch({ type: "SET_CUSTOM_SITES_ID_API_ENDPOINT", payload: null });
		}
	}, [sites, querySiteId, state.customSitesApiEndpoint]);

	// `siteId` SWR hook
	const { siteId } = useSiteId(state.customSitesIdApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data).length > 0 && !e.data.detail
				? NoInterval
				: RevalidationInterval
	});

	// Update `hasSiteLimitReached` state value
	useEffect(() => {
		if (
			user &&
			user.data &&
			Object.keys(user.data).length > 0 &&
			sites &&
			sites.data &&
			Object.keys(sites.data).length > 0
		) {
			// Handle `hasSiteLimitReached` value
			const userMaxSites = user.data.group.max_sites || null;
			const sitesCount = sites.data.count || null;

			if (userMaxSites && sitesCount) {
				if (sitesCount >= userMaxSites) {
					dispatch({ type: "SET_HAS_SITE_LIMIT_REACHED", payload: true });
				} else {
					dispatch({ type: "SET_HAS_SITE_LIMIT_REACHED", payload: false });
				}
			}
		}
	}, [sites, user]);

	// Custom `scan` and `uptime` SWR hooks
	useEffect(() => {
		if (siteId && siteId.data && Object.keys(siteId.data).length > 0 && state.customSitesIdApiEndpoint.length > 0) {
			dispatch({ type: "SET_CUSTOM_UPTIME_API_ENDPOINT", payload: state.customSitesIdApiEndpoint + UptimeSlug });
			dispatch({ type: "SET_CUSTOM_SCAN_API_ENDPOINT", payload: state.customSitesIdApiEndpoint + ScanSlug });
		} else {
			dispatch({ type: "SET_CUSTOM_SCAN_API_ENDPOINT", payload: null });
			dispatch({ type: "SET_CUSTOM_UPTIME_API_ENDPOINT", payload: null });
		}
	}, [siteId, state.customSitesIdApiEndpoint]);

	// Custom `scan` and `uptime` SWR hooks
	useEffect(() => {
		if (state.customUptimeApiEndpoint.length > 0) {
			dispatch({
				type: "SET_CUSTOM_UPTIME_SUMMARY_API_ENDPOINT",
				payload: state.customUptimeApiEndpoint + SummarySlug
			});
		} else {
			dispatch({ type: "SET_CUSTOM_UPTIME_SUMMARY_API_ENDPOINT", payload: null });
		}
	}, [state.customUptimeApiEndpoint]);

	// `uptime` SWR hook
	const { uptime } = useUptime(state.customUptimeApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data).length > 0 && !e.data.detail
				? NoInterval
				: RevalidationInterval
	});

	// `uptime summary` SWR hook
	const { uptimeSummary } = useUptimeSummary(state.customUptimeSummaryApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data).length > 0 && !e.data.detail
				? NoInterval
				: RevalidationInterval
	});

	// `scan` SWR hook
	const {
		handleCrawl,
		isCrawlFinished,
		isCrawlStarted,
		isProcessing,
		previousScan,
		currentScan,
		scan,
		scanObjId,
		selectedSiteRef,
		validatingScan
	} = useScan(state.customScanApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data).length > 0 && !e.data.detail
				? NoInterval
				: RevalidationInterval
	});

	// Custom `stats` API endpoint state
	useEffect(() => {
		if (scan && scan.data && Object.keys(scan.data).length > 0 && scanObjId && state.customScanApiEndpoint.length > 0) {
			dispatch({ type: "SET_CUSTOM_STATS_API_ENDPOINT", payload: state.customScanApiEndpoint + scanObjId });
		} else {
			dispatch({ type: "SET_CUSTOM_STATS_API_ENDPOINT", payload: null });
		}
	}, [scan, state.customScanApiEndpoint, scanObjId]);

	// `stats` SWR hook
	const { stats } = useStats(state.customStatsApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data).length > 0 && !e.data.detail
				? NoInterval
				: RevalidationInterval
	});

	// Custom API endpoint states that rely on `siteId` and `scanObjId` values
	useEffect(() => {
		if (
			user &&
			user.data &&
			Object.keys(user.data).length > 0 &&
			stats &&
			stats.data &&
			Object.keys(stats.data).length > 0
		) {
			const permissions = user.data.permissions || null;

			if (state.customStatsApiEndpoint.length > 0) {
				dispatch({ type: "SET_CUSTOM_LINKS_API_ENDPOINT", payload: state.customStatsApiEndpoint + SiteLinkSlug });

				if (
					permissions &&
					permissions.includes("can_see_pages") &&
					permissions.includes("can_see_scripts") &&
					permissions.includes("can_see_stylesheets") &&
					permissions.includes("can_see_images")
				) {
					dispatch({ type: "SET_CUSTOM_PAGES_API_ENDPOINT", payload: state.customStatsApiEndpoint + SitePageSlug });
					dispatch({ type: "SET_CUSTOM_IMAGES_API_ENDPOINT", payload: state.customStatsApiEndpoint + SiteImageSlug });
				} else {
					dispatch({ type: "SET_CUSTOM_PAGES_API_ENDPOINT", payload: null });
					dispatch({ type: "SET_CUSTOM_IMAGES_API_ENDPOINT", payload: null });
				}
			} else {
				dispatch({ type: "SET_CUSTOM_LINKS_API_ENDPOINT", payload: null });
			}
		}
	}, [stats, user, state.customStatsApiEndpoint]);

	// `links` SWR hook
	const { links } = useLinks(state.customLinksApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data).length > 0 && !e.data.detail
				? NoInterval
				: RevalidationInterval
	});

	// `pages` SWR hook
	const { pages } = usePages(state.customPagesApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data).length > 0 && !e.data.detail
				? NoInterval
				: RevalidationInterval
	});

	// `images` SWR hook
	const { images } = useImages(state.customImagesApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data)?.length > 0 && !e.data?.detail
				? NoInterval
				: RevalidationInterval
	});

	// Custom `linkId` SWR hook
	useEffect(() => {
		if (
			links &&
			links.data &&
			Object.keys(links.data).length > 0 &&
			state.customLinksApiEndpoint.length > 0 &&
			queryLinkId
		) {
			dispatch({ type: "SET_CUSTOM_LINKS_ID_API_ENDPOINT", payload: state.customLinksIdApiEndpoint + queryLinkId });
		} else {
			dispatch({ type: "SET_CUSTOM_LINKS_ID_API_ENDPOINT", payload: null });
		}
	}, [links, queryLinkId, state.customLinksApiEndpoint]);

	// `linkId` SWR hook
	const { linkId } = useLinkId(state.customLinksIdApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data).length > 0 && !e.data.detail
				? NoInterval
				: RevalidationInterval
	});

	// Custom `pageId` SWR hook
	useEffect(() => {
		if (
			pages &&
			pages.data &&
			Object.keys(pages.data).length > 0 &&
			state.customPagesApiEndpoint.length > 0 &&
			queryPageId
		) {
			dispatch({ type: "SET_CUSTOM_PAGES_ID_API_ENDPOINT", payload: state.customPagesIdApiEndpoint + queryPageId });
		} else {
			dispatch({ type: "SET_CUSTOM_PAGES_ID_API_ENDPOINT", payload: null });
		}
	}, [pages, queryPageId, state.customPagesApiEndpoint]);

	// `pageId` SWR hook
	const { pageId } = usePageId(state.customPagesIdApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data).length > 0 && !e.data.detail
				? NoInterval
				: RevalidationInterval
	});

	// Custom `imageId` API endpoint
	useEffect(() => {
		if (
			images &&
			images.data &&
			Object.keys(images.data).length > 0 &&
			state.customImagesApiEndpoint.length > 0 &&
			queryImageId
		) {
			dispatch({ type: "SET_CUSTOM_IMAGES_ID_API_ENDPOINT", payload: state.customImagesIdApiEndpoint + queryImageId });
		} else {
			dispatch({ type: "SET_CUSTOM_IMAGES_ID_API_ENDPOINT", payload: null });
		}
	}, [images, queryImageId, state.customImagesApiEndpoint]);

	// `imageId` SWR hook
	const { imageId } = useImageId(state.customImagesIdApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e.status / 100) === 2 && e.data && Object.keys(e.data).length > 0 && !e.data.detail
				? NoInterval
				: RevalidationInterval
	});

	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout || ((page) => page);

	return getLayout(
		<SiteCrawlerAppContext.Provider
			value={{
				currentScan,
				currentSubscription,
				state,
				defaultPaymentMethod,
				handleCrawl,
				imageId,
				images,
				isCrawlFinished,
				isCrawlStarted,
				isProcessing,
				linkId,
				links,
				pageId,
				pages,
				paymentMethods,
				previousScan,
				queryImageId,
				queryLinkId,
				queryPageId,
				querySiteId,
				scan,
				scanObjId,
				selectedSiteRef,
				setConfig,
				siteId,
				sites,
				notificationMessageState,
				stats,
				stripePromise,
				subscriptions,
				uptime,
				uptimeSummary,
				user
			}}
		>
			<MemoizedProgressBar />
			<DefaultSeo {...AppSeo} />
			<Component {...pageProps} err={err} />
		</SiteCrawlerAppContext.Provider>
	);
}

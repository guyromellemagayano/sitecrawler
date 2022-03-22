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
import { DashboardSlug, ScanSlug, SiteImageSlug, SiteLinkSlug, SitePageSlug } from "@constants/PageLinks";
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
import { useUser } from "@hooks/useUser";
import "@styles/tailwind.css";
import { handleConversionStringToNumber } from "@utils/convertCase";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import { createContext, useEffect, useMemo, useState } from "react";

// Font Awesome
library.add(fab);
library.add(fas);
library.add(far);

/**
 * Create new App context
 */
export const SiteCrawlerAppContext = createContext();

export default function SiteCrawlerApp({ Component, pageProps, err }) {
	const [isComponentReady, setIsComponentReady] = useState(false);
	const [isUserReady, setIsUserReady] = useState(false);
	const [customSitesApiEndpoint, setCustomSitesApiEndpoint] = useState(null);
	const [customStatsApiEndpoint, setCustomStatsApiEndpoint] = useState(null);
	const [customStripePromiseApiEndpoint, setCustomStripePromiseApiEndpoint] = useState(null);
	const [customPaymentMethodsApiEndpoint, setCustomPaymentMethodsApiEndpoint] = useState(null);
	const [customDefaultPaymentMethodApiEndpoint, setCustomDefaultPaymentMethodApiEndpoint] = useState(null);
	const [customSubscriptionsApiEndpoint, setCustomSubscriptionsApiEndpoint] = useState(null);
	const [customCurrentSubscriptionApiEndpoint, setCustomCurrentSubscriptionApiEndpoint] = useState(null);
	const [customSitesIdApiEndpoint, setCustomSitesIdApiEndpoint] = useState(null);
	const [customScanApiEndpoint, setCustomScanApiEndpoint] = useState(null);
	const [customLinksApiEndpoint, setCustomLinksApiEndpoint] = useState(null);
	const [customLinksIdApiEndpoint, setCustomLinksIdApiEndpoint] = useState(null);
	const [customPagesApiEndpoint, setCustomPagesApiEndpoint] = useState(null);
	const [customPagesIdApiEndpoint, setCustomPagesIdApiEndpoint] = useState(null);
	const [customImagesApiEndpoint, setCustomImagesApiEndpoint] = useState(null);
	const [customImagesIdApiEndpoint, setCustomImagesIdApiEndpoint] = useState(null);
	const [hasSiteLimitReached, setHasSiteLimitReached] = useState(false);

	// Router
	const { isReady, query, asPath } = useRouter();

	// Custom hooks
	const { state, setConfig } = useNotificationMessage();

	// `user` SWR hook
	const { user, errorUser, validatingUser } = useUser(UserApiEndpoint);

	// Handle component loading
	useEffect(() => {
		if (isReady) {
			// LogRocket setup
			if (isProd) {
				LogRocket.init(process.env.LOGROCKET_APP_ID);
				setupLogRocketReact(LogRocket);
			}

			if (!asPath.includes(DashboardSlug)) {
				// Handle `user` promise data
				if (user && Math.round(user.status / 100) === 4 && user.data?.detail) {
					setIsComponentReady(true);
					setIsUserReady(false);
				} else {
					setIsComponentReady(false);
				}
			} else {
				// Handle `user` promise data
				if (user && Math.round(user.status / 100) === 2 && !user.data?.detail) {
					setIsComponentReady(true);
					setIsUserReady(true);
				} else {
					setIsComponentReady(false);
					setIsUserReady(false);
				}
			}
		}

		return async () =>
			await new Promise((resolve) => {
				setTimeout(() => resolve(isComponentReady), ComponentReadyInterval);
			}).then((result) => result);
	}, [isReady, user, asPath]);

	// Custom API endpoint states that rely on `user` value
	useEffect(() => {
		if (isUserReady) {
			setCustomSitesApiEndpoint(SitesApiEndpoint);
			setCustomStripePromiseApiEndpoint(StripePromiseApiEndpoint);
			setCustomPaymentMethodsApiEndpoint(PaymentMethodApiEndpoint);
			setCustomDefaultPaymentMethodApiEndpoint(DefaultPaymentMethodApiEndpoint);
			setCustomSubscriptionsApiEndpoint(SubscriptionsApiEndpoint);
			setCustomCurrentSubscriptionApiEndpoint(CurrentSubscriptionApiEndpoint);
		} else {
			setCustomSitesApiEndpoint(null);
			setCustomStripePromiseApiEndpoint(null);
			setCustomPaymentMethodsApiEndpoint(null);
			setCustomDefaultPaymentMethodApiEndpoint(null);
			setCustomSubscriptionsApiEndpoint(null);
			setCustomCurrentSubscriptionApiEndpoint(null);
		}

		return {
			customSitesApiEndpoint,
			customStripePromiseApiEndpoint,
			customPaymentMethodsApiEndpoint,
			customDefaultPaymentMethodApiEndpoint,
			customSubscriptionsApiEndpoint,
			customCurrentSubscriptionApiEndpoint
		};
	}, [isUserReady]);

	// `stripePromise` SWR hook
	const { stripePromise, errorStripePromise, validatingStripePromise } =
		useStripePromise(customStripePromiseApiEndpoint);

	// `paymentMethods` SWR hook
	const { paymentMethods, errorPaymentMethods, validatingPaymentMethods } = usePaymentMethods(
		customPaymentMethodsApiEndpoint
	);

	// `defaultPaymentMethod` SWR hook
	const { defaultPaymentMethod, errorDefaultPaymentMethod, validatingDefaultPaymentMethod } = useDefaultPaymentMethod(
		customDefaultPaymentMethodApiEndpoint
	);

	// `subscriptions` SWR hook
	const { subscriptions, errorSubscriptions, validatingSubscriptions } =
		useSubscriptions(customSubscriptionsApiEndpoint);

	// `currentSubscription` SWR hook
	const { currentSubscription, errorCurrentSubscription, validatingCurrentSubscription } = useCurrentSubscription(
		customCurrentSubscriptionApiEndpoint
	);

	// `sites` SWR hook
	const { sites, errorSites, validatingSites } = useSites(customSitesApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e?.status / 100) === 2 && !e?.data?.detail ? NoInterval : RevalidationInterval
	});

	// console.log("sites", sites);

	// Custom variables
	const querySiteId = query?.siteId ? handleConversionStringToNumber(query.siteId) : null;
	const queryLinkId = query?.linkId ? handleConversionStringToNumber(query.linkId) : null;
	const queryPageId = query?.pageId ? handleConversionStringToNumber(query.pageId) : null;
	const queryImageId = query?.imageId ? handleConversionStringToNumber(query.imageId) : null;

	// Custom `siteId` SWR hook
	useEffect(() => {
		const verifiedSiteId = sites?.data?.results?.find((site) => site.id === querySiteId) ? querySiteId : null;

		sites && isUserReady && verifiedSiteId
			? setCustomSitesIdApiEndpoint(customSitesApiEndpoint + verifiedSiteId)
			: setCustomSitesIdApiEndpoint(null);

		return { customSitesIdApiEndpoint };
	}, [isUserReady, sites, querySiteId]);

	// `siteId` SWR hook
	const { siteId, errorSiteId, validatingSiteId } = useSiteId(customSitesIdApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e?.status / 100) === 2 && !e?.data?.detail ? NoInterval : RevalidationInterval
	});

	// console.log("siteId", siteId);

	// Update `hasSiteLimitReached` state value
	useMemo(() => {
		// Handle `hasSiteLimitReached` value
		const userMaxSites = user?.data?.group?.max_sites ?? null;
		const sitesCount = sites?.data?.count ?? null;

		if (userMaxSites && sitesCount) {
			setHasSiteLimitReached(sitesCount >= userMaxSites);
		}

		return { hasSiteLimitReached };
	}, [sites, user]);

	// Custom `scan` SWR hook
	useEffect(() => {
		siteId ? setCustomScanApiEndpoint(customSitesIdApiEndpoint + ScanSlug) : setCustomScanApiEndpoint(null);

		return { customScanApiEndpoint };
	}, [siteId]);

	// `scan` SWR hook
	const {
		currentScan,
		errorScan,
		handleCrawl,
		isCrawlFinished,
		isCrawlStarted,
		isProcessing,
		previousScan,
		scan,
		scanObjId,
		selectedSiteRef,
		validatingScan
	} = useScan(customScanApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e?.status / 100) === 2 && !e?.data?.detail ? NoInterval : RevalidationInterval
	});

	// console.log("scan", scan);

	// Custom `stats` API endpoint state
	useEffect(() => {
		scanObjId ? setCustomStatsApiEndpoint(customScanApiEndpoint + scanObjId) : setCustomStatsApiEndpoint(null);

		return { customStatsApiEndpoint };
	}, [scanObjId]);

	// `stats` SWR hook
	const { stats, errorStats, validatingStats } = useStats(customStatsApiEndpoint, {
		refreshInterval: (e) =>
			e && Math.round(e?.status / 100) === 2 && !e?.data?.detail ? NoInterval : RevalidationInterval
	});

	// console.log("stats", stats);

	// Custom API endpoint states that rely on `siteId` and `scanObjId` values
	useEffect(() => {
		if (user) {
			const permissions = user?.data?.permissions ?? null;

			if (stats) {
				setCustomLinksApiEndpoint(customStatsApiEndpoint + SiteLinkSlug);

				if (
					permissions &&
					permissions?.includes("can_see_pages") &&
					permissions?.includes("can_see_scripts") &&
					permissions?.includes("can_see_stylesheets") &&
					permissions?.includes("can_see_images")
				) {
					if (customStatsApiEndpoint) {
						setCustomPagesApiEndpoint(customStatsApiEndpoint + SitePageSlug);
						setCustomImagesApiEndpoint(customStatsApiEndpoint + SiteImageSlug);
					} else {
						setCustomPagesIdApiEndpoint(null);
						setCustomImagesIdApiEndpoint(null);
					}
				}
			} else {
				setCustomLinksIdApiEndpoint(null);
			}
		}

		return {
			customLinksApiEndpoint,
			customPagesApiEndpoint,
			customImagesApiEndpoint
		};
	}, [stats, user]);

	// `links` SWR hook
	const { links, errorLinks, validatingLinks } = useLinks(customLinksApiEndpoint);

	// console.log("links", links);

	// `pages` SWR hook
	const { pages, errorPages, validatingPages } = usePages(customPagesApiEndpoint);

	// console.log("pages", pages);

	// `images` SWR hook
	const { images, errorImages, validatingImages } = useImages(customImagesApiEndpoint);

	// console.log("images", images);

	// Custom `linkId` SWR hook
	useEffect(() => {
		const verifiedLinkId = queryLinkId ? links?.data?.results?.find((link) => link.id === queryLinkId) ?? null : null;

		links && isUserReady && verifiedLinkId
			? setCustomLinksIdApiEndpoint(customSitesApiEndpoint + verifiedLinkId)
			: setCustomLinksIdApiEndpoint(null);

		return { customLinksIdApiEndpoint };
	}, [isUserReady, links, queryLinkId]);

	// `linkId` SWR hook
	const { linkId, errorLinkId, validatingLinkId } = useLinkId(customLinksIdApiEndpoint);

	// console.log("linkId", linkId);

	// Custom `pageId` SWR hook
	useEffect(() => {
		const verifiedPageId = queryPageId ? pages?.data?.results?.find((page) => page.id === queryPageId) ?? null : null;

		pages && isUserReady && verifiedPageId
			? setCustomPagesIdApiEndpoint(customSitesApiEndpoint + verifiedPageId)
			: setCustomPagesIdApiEndpoint(null);

		return { customPagesIdApiEndpoint };
	}, [isUserReady, pages, queryPageId]);

	// `pageId` SWR hook
	const { pageId, errorPageId, validatingPageId } = usePageId(customPagesIdApiEndpoint);

	// console.log("pageId", pageId);

	// Custom `imageId` API endpoint
	useEffect(() => {
		const verifiedImageId = queryImageId
			? images?.data?.results?.find((image) => image.id === queryImageId) ?? null
			: null;

		images && isUserReady && verifiedImageId
			? setCustomImagesIdApiEndpoint(customSitesApiEndpoint + verifiedImageId)
			: setCustomImagesIdApiEndpoint(null);

		return { customImagesApiEndpoint };
	}, [isUserReady, images, queryImageId]);

	// `imageId` SWR hook
	const { imageId, errorImageId, validatingImageId } = useImageId(customImagesIdApiEndpoint);

	// console.log("imageId", imageId);

	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout || ((page) => page);

	return getLayout(
		<SiteCrawlerAppContext.Provider
			value={{
				currentScan,
				currentSubscription,
				defaultPaymentMethod,
				errorCurrentSubscription,
				errorDefaultPaymentMethod,
				customScanApiEndpoint,
				errorImageId,
				errorImages,
				errorLinkId,
				errorLinks,
				errorPageId,
				errorPages,
				errorPaymentMethods,
				errorScan,
				errorSiteId,
				errorSites,
				errorStats,
				errorStripePromise,
				errorSubscriptions,
				errorUser,
				handleCrawl,
				hasSiteLimitReached,
				imageId,
				images,
				isComponentReady,
				isCrawlFinished,
				isCrawlStarted,
				isProcessing,
				isUserReady,
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
				state,
				stats,
				stripePromise,
				subscriptions,
				user,
				validatingCurrentSubscription,
				validatingDefaultPaymentMethod,
				validatingImageId,
				validatingImages,
				validatingLinkId,
				validatingLinks,
				validatingPageId,
				validatingPages,
				validatingPaymentMethods,
				validatingScan,
				validatingSiteId,
				validatingSites,
				validatingStats,
				validatingStripePromise,
				validatingSubscriptions,
				validatingUser
			}}
		>
			<MemoizedProgressBar />
			<DefaultSeo {...AppSeo} />
			<Component {...pageProps} err={err} />
		</SiteCrawlerAppContext.Provider>
	);
}

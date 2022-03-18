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
import { ComponentReadyInterval, orderingByNameQuery, sortByFinishedAtDescending } from "@constants/GlobalValues";
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

			if (user) {
				if (!asPath.includes(DashboardSlug)) {
					// Handle `user` promise data
					if (Math.round(user.status / 100) === 4 && user.data?.detail) {
						setIsComponentReady(true);
						setIsUserReady(false);
					}
				} else {
					// Handle `user` promise data
					if (Math.round(user.status / 100) === 2 && !user.data?.detail) {
						setIsComponentReady(true);
						setIsUserReady(true);
					}
				}
			}
		}

		return async () =>
			await new Promise((resolve) => {
				setTimeout(() => resolve(isComponentReady), ComponentReadyInterval);
			}).then((result) => result);
	}, [isReady, user, asPath]);

	// Custom API endpoint states that rely on `user` value
	useMemo(() => {
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
	const { sites, errorSites, validatingSites } = useSites(customSitesApiEndpoint);

	// Custom variables
	const querySiteId = query?.siteId ?? null;
	const queryLinkId = query?.linkId ?? null;
	const queryPageId = query?.pageId ?? null;
	const queryImageId = query?.imageId ?? null;

	// Custom `siteId` SWR hook
	useMemo(() => {
		const verifiedSiteId = sites?.data?.results?.find((site) => site.id === querySiteId) ? querySiteId : null;

		customSitesApiEndpoint && isUserReady && verifiedSiteId
			? setCustomSitesIdApiEndpoint(customSitesApiEndpoint + verifiedSiteId)
			: setCustomSitesIdApiEndpoint(null);

		return { customSitesIdApiEndpoint };
	}, [isUserReady, sites, customSitesApiEndpoint, querySiteId]);

	// `siteId` SWR hook
	const { siteId, errorSiteId, validatingSiteId } = useSiteId(customSitesIdApiEndpoint);

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
	useMemo(() => {
		customSitesIdApiEndpoint
			? setCustomScanApiEndpoint(
					customSitesIdApiEndpoint + ScanSlug + "?" + orderingByNameQuery + sortByFinishedAtDescending
			  )
			: setCustomScanApiEndpoint(null);

		return { customScanApiEndpoint };
	}, [customSitesIdApiEndpoint]);

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
	} = useScan(customScanApiEndpoint);

	// Custom `stats` API endpoint state
	useMemo(() => {
		customSitesIdApiEndpoint && scanObjId
			? setCustomStatsApiEndpoint(customSitesIdApiEndpoint + ScanSlug + scanObjId)
			: setCustomStatsApiEndpoint(null);

		return { customStatsApiEndpoint };
	}, [customSitesIdApiEndpoint, scanObjId]);

	// `stats` SWR hook
	const { stats, errorStats, validatingStats } = useStats(customStatsApiEndpoint);

	// Custom API endpoint states that rely on `siteId` and `scanObjId` values
	useMemo(() => {
		if (customStatsApiEndpoint) {
			setCustomLinksApiEndpoint(customStatsApiEndpoint + SiteLinkSlug);
			setCustomPagesApiEndpoint(customStatsApiEndpoint + SitePageSlug);
			setCustomImagesApiEndpoint(customStatsApiEndpoint + SiteImageSlug);
		} else {
			setCustomLinksIdApiEndpoint(null);
			setCustomPagesIdApiEndpoint(null);
			setCustomImagesIdApiEndpoint(null);
		}

		return {
			customLinksApiEndpoint,
			customPagesApiEndpoint,
			customImagesApiEndpoint
		};
	}, [customStatsApiEndpoint]);

	// `links` SWR hook
	const { links, errorLinks, validatingLinks } = useLinks(customLinksApiEndpoint);

	// `pages` SWR hook
	const { pages, errorPages, validatingPages } = usePages(customPagesApiEndpoint);

	// `images` SWR hook
	const { images, errorImages, validatingImages } = useImages(customImagesApiEndpoint);

	// Custom `linkId` SWR hook
	useMemo(() => {
		const verifiedLinkId = links?.data?.results?.find((link) => link.id === queryLinkId) ? queryLinkId : null;

		customLinksApiEndpoint && isUserReady && verifiedLinkId
			? setCustomLinksIdApiEndpoint(customSitesApiEndpoint + verifiedLinkId)
			: setCustomLinksIdApiEndpoint(null);

		return { customLinksIdApiEndpoint };
	}, [isUserReady, links, customLinksApiEndpoint, queryLinkId]);

	// `linkId` SWR hook
	const { linkId, errorLinkId, validatingLinkId } = useLinkId(customLinksIdApiEndpoint);

	// Custom `pageId` SWR hook
	useMemo(() => {
		const verifiedPageId = pages?.data?.results?.find((page) => page.id === queryPageId) ? queryPageId : null;

		customPagesApiEndpoint && isUserReady && verifiedPageId
			? setCustomPagesIdApiEndpoint(customSitesApiEndpoint + verifiedPageId)
			: setCustomPagesIdApiEndpoint(null);

		return { customPagesIdApiEndpoint };
	}, [isUserReady, pages, customPagesApiEndpoint, queryPageId]);

	// `pageId` SWR hook
	const { pageId, errorPageId, validatingPageId } = usePageId(customPagesIdApiEndpoint);

	// Custom `imageId` API endpoint
	useMemo(() => {
		const verifiedImageId = images?.data?.results?.find((image) => image.id === queryImageId) ? queryImageId : null;

		customImagesApiEndpoint && isUserReady && verifiedImageId
			? setCustomImagesIdApiEndpoint(customSitesApiEndpoint + verifiedImageId)
			: setCustomImagesIdApiEndpoint(null);

		return { customImagesApiEndpoint };
	}, [isUserReady, images, customImagesApiEndpoint, queryImageId]);

	// `imageId` SWR hook
	const { imageId, errorImageId, validatingImageId } = useImageId(customImagesIdApiEndpoint);

	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout || ((page) => page);

	return getLayout(
		<SiteCrawlerAppContext.Provider
			value={{
				state,
				setConfig,
				user,
				errorUser,
				validatingUser,
				isComponentReady,
				isUserReady,
				sites,
				errorSites,
				validatingSites,
				hasSiteLimitReached,
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
				validatingScan,
				stats,
				errorStats,
				validatingStats,
				stripePromise,
				errorStripePromise,
				validatingStripePromise,
				defaultPaymentMethod,
				errorDefaultPaymentMethod,
				validatingDefaultPaymentMethod,
				subscriptions,
				errorSubscriptions,
				validatingSubscriptions,
				currentSubscription,
				errorCurrentSubscription,
				validatingCurrentSubscription,
				siteId,
				errorSiteId,
				validatingSiteId,
				links,
				errorLinks,
				validatingLinks,
				pages,
				errorPages,
				validatingPages,
				images,
				errorImages,
				validatingImages,
				linkId,
				errorLinkId,
				validatingLinkId,
				pageId,
				errorPageId,
				validatingPageId,
				imageId,
				errorImageId,
				validatingImageId,
				querySiteId,
				queryLinkId,
				queryPageId,
				queryImageId
			}}
		>
			<DefaultSeo {...AppSeo} />
			<Component {...pageProps} err={err} />
		</SiteCrawlerAppContext.Provider>
	);
}

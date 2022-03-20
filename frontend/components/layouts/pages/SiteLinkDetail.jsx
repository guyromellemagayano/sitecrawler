const { useImageId } = require("@hooks/useImageId");
const { useImages } = require("@hooks/useImages");
const { useScan } = require("@hooks/useScan");
const { useScanApiEndpoint } = require("@hooks/useScanApiEndpoint");
const { SiteCrawlerAppContext } = require("@pages/_app");
const { handleConversionStringToNumber } = require("@utils/convertCase");
const { useRouter } = require("next/router");
const { useContext } = require("react");

/**
 * Custom function to render the `SiteLinkDetailPageLayout` component
 */
const SiteLinkDetailPageLayout = () => {
	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// Router
	const { query } = useRouter();
	const { siteId, linkId } = query;

	// Custom variables
	const sanitizedSiteId = handleConversionStringToNumber(siteId);
	const sanitizedLinkId = handleConversionStringToNumber(linkId);

	// Helper functions
	const { scanObjId } = useScan(sanitizedSiteId);

	// SWR hooks
	const {
		imageId,
		createdAt,
		scanId,
		type,
		url,
		status,
		statusAdjusted,
		httpStatus,
		responseTime,
		error,
		size,
		tlsStatus,
		tlsStatusAdjusted,
		resolvedStatus,
		resolvedTls,
		missingAlts,
		missingAltsAdjusted,
		resolvedMissingAlts,
		pages
	} = useImageId(sanitizedSiteId);

	return <h1>Hello</h1>;
};

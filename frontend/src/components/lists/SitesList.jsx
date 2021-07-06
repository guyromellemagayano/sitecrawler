// React
import * as React from "react";

// External
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// Hooks
import { useScan, useStats } from "src/hooks/useSite";

const SitesList = (props) => {
	const [scanFinishedAt, setScanFinishedAt] = React.useState(null);
	const [scanForceHttps, setScanForceHttps] = React.useState(null);
	const [scanCount, setScanCount] = React.useState(null);
	const [scanObjId, setScanObjId] = React.useState(null);

	const { scan } = useScan({
		querySid: props.id
	});

	React.useEffect(() => {
		const currentScanCount = scan?.count;
		const currentScanFinishedAt = scan?.results[0]?.finished_at ?? null;
		const currentScanForcehttps = scan?.results[0]?.force_https ?? null;
		const currentScanObjId =
			currentScanFinishedAt !== null && currentScanForcehttps !== null && currentScanCount > 1
				? scan?.results[1]?.id
				: scan?.results[0]?.id;

		setScanFinishedAt(currentScanFinishedAt);
		setScanForceHttps(currentScanForcehttps);
		setScanCount(currentScanCount);
		setScanObjId(currentScanObjId);

		return { scanFinishedAt, scanForceHttps, scanCount, scanObjId };
	}, [scan]);

	const { stats } = useStats({
		querySid: props.id,
		scanObjId: scanObjId
	});

	const handleSiteSelection = (siteId, verified, scanCount) => {
		return verified
			? props.handleDropdownHandler(siteId)
			: (() => {
					scanCount > 0 ? props.handleDropdownHandler(siteId) : false;
			  })();
	};

	return (
		<li
			id={`listbox-item-${props.id}`}
			role="option"
			css={[
				tw`select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`,
				scanCount > 0 && (stats?.num_links > 0 || stats?.num_pages > 0 || stats?.num_images > 0)
					? tw`cursor-pointer`
					: tw`cursor-not-allowed`
			]}
			onClick={() => {
				scanCount > 0 && (stats?.num_links > 0 || stats?.num_pages > 0 || stats?.num_images > 0)
					? handleSiteSelection(props.id, props.verified, scanCount)
					: null;
			}}
		>
			<div tw="flex items-center space-x-3">
				{props.sitesLoaded ? (
					<span
						aria-label={
							props.verified
								? scanFinishedAt == null && scanForceHttps == null
									? "Recrawling in Process"
									: "Verified"
								: "Not Verified"
						}
						css={[
							tw`flex-shrink-0 inline-block h-2 w-2 rounded-full`,
							props.verified
								? scanFinishedAt == null && scanForceHttps == null
									? tw`bg-yellow-400`
									: tw`bg-green-400`
								: tw`bg-red-400`
						]}
					/>
				) : (
					<Skeleton circle={true} duration={2} width={10} height={10} tw="relative top-0.5" />
				)}

				<span
					css={[
						tw`font-medium block truncate`,
						(props.verified || scanCount > 0) &&
						(stats?.num_links == 0 || stats?.num_pages == 0 || stats?.num_images == 0)
							? tw`text-gray-400`
							: tw`text-gray-500`
					]}
				>
					{props.sitesLoaded ? props.name : <Skeleton duration={2} width={130} />}
				</span>
			</div>
		</li>
	);
};

SitesList.propTypes = {};

export default SitesList;

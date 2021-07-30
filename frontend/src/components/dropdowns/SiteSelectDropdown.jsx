// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";
import Link from "next/link";

// External
import "twin.macro";
import { PlusIcon } from "@heroicons/react/solid";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Transition } from "@headlessui/react";
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// JSON
import PrimaryMenuLabel from "public/labels/components/sidebar/PrimaryMenu.json";

// Hooks
import useCrawl from "@hooks/useCrawl";

// Loadable
const SitesList = loadable(() => import("@components"), {
	resolveComponent: (components) => components.SitesList
});

const SiteSelectDropdown = ({ site, selectedSiteId, handleSiteSelectOnLoad, isComponentVisible }) => {
	const [sitesLoaded, setSitesLoaded] = React.useState(false);
	const [scanObjId, setScanObjId] = React.useState(null);

	const AddNewSiteLink = `/sites/add-new-site/`;

	const router = useRouter();

	const { currentScan, previousScan, scanCount } = useCrawl({
		siteId: selectedSiteId
	});

	React.useEffect(() => {
		const handleScanObjId = (scanCount, currentScan, previousScan) => {
			scanCount > 1
				? previousScan !== undefined
					? setScanObjId(previousScan?.id)
					: false
				: currentScan !== undefined
				? setScanObjId(currentScan?.id)
				: setScanObjId(previousScan?.id);

			return scanObjId;
		};

		return handleScanObjId(scanCount, currentScan, previousScan);
	}, [scanCount, currentScan, previousScan, scanObjId, selectedSiteId]);

	const handleDropdownHandler = (siteId) => {
		return handleSiteSelectOnLoad(siteId);
	};

	React.useEffect(() => {
		if (scanObjId && selectedSiteId) {
			setTimeout(() => {
				router.push({
					pathname: `/site/[siteId]/overview/`,
					query: {
						siteId: selectedSiteId,
						scanObjId: scanObjId
					}
				});
			}, 500);
		} else {
			return false;
		}
	}, [scanObjId, selectedSiteId]);

	React.useEffect(() => {
		isComponentVisible
			? (() => {
					setTimeout(() => {
						setSitesLoaded(true);
					}, 500);
			  })()
			: setSitesLoaded(false);
	}, [isComponentVisible]);

	return (
		<Transition
			show={isComponentVisible}
			enter="transition ease-out duration-100"
			enterFrom="transform opacity-0 scale-95"
			enterTo="transform opacity-100 scale-100"
			leave="transition ease-in duration-75"
			leaveFrom="transform opacity-100 scale-100"
			leaveTo="transform opacity-0 scale-95"
			tw="absolute mt-1 w-full rounded-md bg-white shadow-lg overflow-hidden"
		>
			{site?.results ? (
				site?.results?.length > 0 ? (
					<ul
						tabIndex="-1"
						role="listbox"
						aria-labelledby="listbox-label"
						tw="pt-2 h-48 text-base leading-6 overflow-auto focus:outline-none sm:text-sm sm:leading-5"
					>
						<Scrollbars universal>
							{site?.results.map((value, index) => {
								return (
									<SitesList
										key={index}
										id={value?.id}
										name={value?.name}
										verified={value?.verified}
										handleDropdownHandler={handleDropdownHandler}
										sitesLoaded={sitesLoaded}
									/>
								);
							})}
						</Scrollbars>
					</ul>
				) : null
			) : null}

			<span tw="relative flex m-2 justify-center shadow-sm rounded-md">
				<Link href={AddNewSiteLink} passHref>
					<a tw="w-full flex items-center justify-center rounded-md px-3 py-2 border border-transparent text-sm leading-4 font-medium text-white bg-green-600 cursor-pointer hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
						<PlusIcon tw="-ml-3 mr-2 h-4 w-4" />
						{PrimaryMenuLabel[2].label}
					</a>
				</Link>
			</span>
		</Transition>
	);
};

SiteSelectDropdown.propTypes = {
	site: PropTypes.object,
	selectedSiteId: PropTypes.number,
	handleSiteSelectOnLoad: PropTypes.func,
	isComponentVisible: PropTypes.bool
};

export default SiteSelectDropdown;

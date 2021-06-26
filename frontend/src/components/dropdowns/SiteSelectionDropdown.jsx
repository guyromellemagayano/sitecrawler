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

// Loadable
const SitesList = loadable(() => import("src/components/lists/SitesList"));

const SiteSelectionDropdown = (props) => {
	const [sitesLoaded, setSitesLoaded] = React.useState(false);
	const [hasScanResults, setHasScanResults] = React.useState(false);

	const AddNewSiteLink = `/sites/add-new-site/`;

	const router = useRouter();

	const handleSiteSelectOnLoad = (siteId) => {
		props.site?.results
			? (() => {
					for (let i = 0; i < props.site?.results.length; i++) {
						if (props.site?.results[i]?.id == siteId) {
							props.setSelectedSite(props.site?.results[i]?.name);
							props.setIsComponentVisible(!props.isComponentVisible);

							setTimeout(() => {
								router.push(`/site/[siteId]/overview`, `/site/${siteId}/overview`);
							}, 500);
						}
					}
			  })()
			: null;
	};

	const handleDropdownHandler = (siteId, verified) => {
		if (!verified) return false;

		handleSiteSelectOnLoad(siteId);
	};

	React.useEffect(() => {
		props.isComponentVisible
			? (() => {
					setTimeout(() => {
						setSitesLoaded(true);
					}, 500);
			  })()
			: setSitesLoaded(false);
	}, [props.isComponentVisible]);

	React.useEffect(() => {
		props.site?.results
			? (() => {
					for (let i = 0; i < props.site?.results.length; i++) {
						if (props.site?.results[i]?.id == props.siteId) {
							props.setSelectedSite(props.site?.results[i]?.name);
						}
					}
			  })()
			: null;
	}, [props.site, props.siteId]);

	React.useEffect(() => {
		props.site?.results
			? props.site?.results
					.filter((result) => result?.name === props.selectedSite)
					.map((val) => {
						props.setSelectedSiteDetails(val);
					})
			: null;

		props.selectedSite
			? props.site?.results
				? () => {
						let currentSite = site?.results.find((result) => result?.id === parseInt(props.siteId));

						if (currentSite !== undefined) {
							props.setSelectedSite(currentSite?.name);
						}
				  }
				: null
			: null;
	}, [props.selectedSite, props.site, props.siteId]);

	return (
		<Transition
			show={props.isComponentVisible}
			enter="transition ease-out duration-100"
			enterFrom="transform opacity-0 scale-95"
			enterTo="transform opacity-100 scale-100"
			leave="transition ease-in duration-75"
			leaveFrom="transform opacity-100 scale-100"
			leaveTo="transform opacity-0 scale-95"
			tw="absolute mt-1 w-full rounded-md bg-white shadow-lg overflow-hidden"
		>
			{props.site?.results ? (
				props.site?.results?.length > 0 ? (
					<Scrollbars style={{ height: 180 }} universal>
						<ul
							tabIndex="-1"
							role="listbox"
							aria-labelledby="listbox-label"
							tw="pt-2 text-base leading-6 overflow-auto focus:outline-none sm:text-sm sm:leading-5"
						>
							{props.site?.results.map((value, index) => {
								return (
									<SitesList
										key={index}
										id={value?.id}
										name={value?.name}
										verified={value?.verified}
										handleDropdownHandler={() => handleDropdownHandler(value?.id, value?.verified)}
										hasScanResults={hasScanResults}
										setHasScanResults={setHasScanResults}
										sitesLoaded={sitesLoaded}
									/>
								);
							})}
						</ul>
					</Scrollbars>
				) : null
			) : null}

			<span tw="flex m-2 justify-center shadow-sm rounded-md">
				<Link href={AddNewSiteLink} passHref>
					<a tw="w-full flex items-center justify-center rounded-md px-3 py-2 border border-transparent text-sm leading-4 font-medium text-white bg-green-600 cursor-pointer hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
						<PlusIcon tw="-ml-3 mr-2 h-4 w-4" />
						{props.label?.[0] ?? null}
					</a>
				</Link>
			</span>
		</Transition>
	);
};

SiteSelectionDropdown.propTypes = {};

export default SiteSelectionDropdown;

// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import { SearchIcon } from "@heroicons/react/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw, { styled } from "twin.macro";

// JSON
import LinkOptionsLabel from "public/labels/components/sites/LinkOptions.json";

// Hooks
import useDropdownOutsideClick from "src/hooks/useDropdownOutsideClick";

// Loadable
const UpgradeErrorModal = loadable(() => import("src/components/modals/UpgradeErrorModal"));

const LinkOptionsDiv = styled.div``;

const LinkOptions = ({
	permissions,
	scanResult,
	searchKey,
	onSearchEvent,
	handleCrawl,
	isCrawlStarted,
	isCrawlFinished
}) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const { ref, isComponentVisible, setIsComponentVisible } = useDropdownOutsideClick(false);

	const { asPath } = useRouter();

	React.useEffect(() => {
		(() => {
			setComponentReady(false);

			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		})();
	}, []);

	return (
		<LinkOptionsDiv ref={ref} tw="flex flex-col w-0 flex-1 overflow-hidden z-10">
			<UpgradeErrorModal show={isComponentVisible} setShowErrorModal={setIsComponentVisible} />

			<div tw="relative z-10 flex-shrink-0 flex bg-white border-b border-gray-200">
				<div tw="flex-1 p-4 flex justify-end">
					<div tw="flex-1 flex">
						<div tw="w-full flex lg:ml-0">
							<label htmlFor="searchSites" tw="sr-only">
								{LinkOptionsLabel[1].label}
							</label>
							<div tw="relative w-full text-gray-400 focus-within:text-gray-600">
								<div tw="absolute inset-y-0 left-0 flex items-center pointer-events-none">
									<SearchIcon tw="h-5 w-5 text-gray-400" />
								</div>
								<input
									type="search"
									name="search-links"
									id="searchlinks"
									tw="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
									placeholder={
										asPath.includes("pages")
											? LinkOptionsLabel[0].label
											: asPath.includes("links")
											? LinkOptionsLabel[1].label
											: asPath.includes("images")
											? LinkOptionsLabel[2].label
											: LinkOptionsLabel[3].label
									}
									onKeyUp={onSearchEvent}
									defaultValue={searchKey}
									autoFocus
								/>
							</div>
						</div>
					</div>

					<div tw="ml-4 flex items-center lg:ml-6">
						{componentReady ? (
							<button
								type="button"
								disabled={isCrawlStarted && !isCrawlFinished}
								onClick={
									permissions?.includes("can_start_scan")
										? handleCrawl
										: () => setIsComponentVisible(!isComponentVisible)
								}
								css={[
									tw`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none`,
									permissions?.includes("can_start_scan")
										? isCrawlStarted && !isCrawlFinished
											? tw`bg-green-600 opacity-50 cursor-not-allowed`
											: tw`bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
										: tw`bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`
								]}
							>
								<span tw="flex items-center space-x-2">
									{permissions?.includes("can_start_scan") ? null : (
										<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />
									)}

									{!isCrawlStarted && isCrawlFinished ? (
										<span>{LinkOptionsLabel[4].label}</span>
									) : (
										<span>{LinkOptionsLabel[5].label}</span>
									)}
								</span>
							</button>
						) : (
							<Skeleton duration={2} width={150} height={40} />
						)}
					</div>
				</div>
			</div>
		</LinkOptionsDiv>
	);
};

LinkOptions.propTypes = {};

export default LinkOptions;

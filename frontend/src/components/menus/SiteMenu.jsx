// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";
import Link from "next/link";

// External
import { ArrowLeftIcon, LinkIcon, SearchIcon, ViewGridIcon } from "@heroicons/react/solid";
import { CogIcon, DocumentTextIcon, PhotographIcon } from "@heroicons/react/outline";
import { Scrollbars } from "react-custom-scrollbars-2";
import PropTypes from "prop-types";
import tw from "twin.macro";

// Enums
import { GlobalLabels, SiteLogoWhite } from "@enums/GlobalValues";
import { SitesLink } from "@enums/PageLinks";
import { SiteSidebarMenu } from "@enums/SidebarMenus";

// Hooks
import { useStats } from "@hooks/useSite";
import useCrawl from "@hooks/useCrawl";

// Components
import AppLogo from "@components/logos/AppLogo";
import SiteSelect from "@components/select/SiteSelect";

const SiteMenu = ({ site, siteId }) => {
	const [scanObjId, setScanObjId] = React.useState(null);

	const { asPath } = useRouter();

	const { currentScan, previousScan, scanCount } = useCrawl({
		siteId: siteId
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
	}, [scanCount, currentScan, previousScan]);

	const { stats } = useStats({
		querySid: siteId,
		scanObjId: scanObjId
	});

	return (
		<Scrollbars
			renderThumbVertical={(props) => <div {...props} className="scroll-dark-bg" />}
			universal
		>
			<div tw="flex flex-col min-h-screen py-4 lg:py-8">
				<div tw="flex items-center flex-shrink-0 flex-row px-3 mb-0">
					<Link href={SitesLink} passHref>
						<a tw="p-1 block w-full cursor-pointer">
							<AppLogo
								className="flex"
								src={SiteLogoWhite}
								alt={GlobalLabels[1].label}
								width={GlobalLabels[1].width}
								height={GlobalLabels[1].height}
							/>
						</a>
					</Link>
				</div>

				<div tw="flex-1 flex flex-col overflow-y-auto">
					<nav tw="flex-1 px-4">
						{SiteSidebarMenu.map((value, index) => {
							return (
								<div key={index} tw="mb-4">
									<h3 tw="mt-8 text-xs leading-4 font-semibold text-gray-200 uppercase tracking-wider">
										{value?.category}
									</h3>

									<div tw="my-3" role="group">
										{value?.links ? (
											value?.links.map((value2, index) => {
												const hrefVal = "/site/[siteId]" + value2?.url;
												const asVal = "/site/" + siteId + value2?.url;

												return value2?.slug !== "go-back-to-sites" ? (
													<Link key={index} href={hrefVal} as={asVal} passHref>
														<a
															className={`group ${
																!asPath.includes("/site/" + siteId + value2?.url)
																	? "hover:bg-gray-1100 focus:bg-gray-1100"
																	: "bg-gray-1100"
															}`}
															css={[
																tw`cursor-pointer`,
																asPath.includes("/site/" + siteId + value2?.url)
																	? tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-100 rounded-md `
																	: tw`mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 focus:outline-none transition ease-in-out duration-150`
															]}
														>
															{value2?.slug === "overview" ? (
																<ViewGridIcon tw="mr-3 h-6 w-5" />
															) : value2?.slug === "links" ? (
																<LinkIcon tw="mr-3 h-6 w-5" />
															) : value2?.slug === "pages" ? (
																<DocumentTextIcon tw="mr-3 h-6 w-5" />
															) : value2?.slug === "images" ? (
																<PhotographIcon tw="mr-3 h-6 w-5" />
															) : value2?.slug === "seo" ? (
																<SearchIcon tw="mr-3 h-6 w-5" />
															) : value2?.slug === "site-settings" ? (
																<CogIcon tw="mr-3 h-6 w-5" />
															) : null}

															{value2?.title ? <span>{value2?.title}</span> : null}

															{value2?.url === "/links" && stats ? (
																<span tw="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black">
																	{stats?.num_links ? stats?.num_links : null}
																</span>
															) : value2?.url === "/pages" && stats ? (
																<span tw="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black">
																	{stats?.num_pages ? stats?.num_pages : null}
																</span>
															) : value2?.url === "/images" && stats ? (
																<span tw="ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black">
																	{stats?.num_images ? stats?.num_images : null}
																</span>
															) : null}
														</a>
													</Link>
												) : (
													<Link key={index} href={value2?.url} passHref>
														<a
															className="group"
															tw="cursor-pointer mt-1 flex items-center py-2 text-sm leading-5 font-medium text-gray-400 rounded-md hover:text-gray-100 focus:outline-none focus:text-white"
														>
															<ArrowLeftIcon tw="mr-3 h-6 w-5" />
															{value2?.title ? <span>{value2?.title}</span> : null}
														</a>
													</Link>
												);
											})
										) : (
											<SiteSelect site={site} siteId={siteId} currentScan={currentScan} />
										)}
									</div>
								</div>
							);
						})}
					</nav>
				</div>
			</div>
		</Scrollbars>
	);
};

SiteMenu.propTypes = {
	site: PropTypes.object,
	siteId: PropTypes.number
};

SiteMenu.defaultProps = {
	site: null,
	siteId: null
};

export default SiteMenu;

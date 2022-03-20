import { MemoizedSiteSelect } from "@components/select/SiteSelect";
import { SiteLogoWhite } from "@components/svgs/SiteLogo";
import { AuthAppLogo } from "@constants/GlobalValues";
import { AddNewSiteSlug, DashboardSitesLink, SitesSlug } from "@constants/PageLinks";
import { SidebarMenus } from "@constants/SidebarMenus";
import { DocumentReportIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useContext } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `PrimaryMenu` component
 */
const PrimaryMenu = () => {
	// Translations
	const { t } = useTranslation("common");
	const appLogo = t("appLogo");

	// Router
	const { asPath } = useRouter();

	// Custom context
	const { isComponentReady, sites } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const sitesCount = sites?.data?.count ?? null;

	// Sidebar menus
	const { PrimarySidebarMenus } = SidebarMenus();

	return (
		<Scrollbars autoHide renderThumbVertical={(props) => <div {...props} className="scroll-dark-bg" />} universal>
			<div className="flex h-full flex-col py-4 lg:py-8">
				<div className="mb-0 flex flex-shrink-0 flex-row items-center px-3">
					<Link href={DashboardSitesLink} passHref>
						<a className="block w-full cursor-pointer p-1">
							<SiteLogoWhite className="flex" width={AuthAppLogo.width} height={AuthAppLogo.height} />
						</a>
					</Link>
				</div>
				{PrimarySidebarMenus?.length > 0 ? (
					<nav className="mt-5 space-y-1 px-3">
						{PrimarySidebarMenus?.filter((e) =>
							!asPath?.includes(DashboardSitesLink + AddNewSiteSlug) ? e.slug !== "navigation" : true
						)?.map((value) => {
							return (
								<div key={value.slug} className="mb-4">
									<h3 className="mt-8 inline-block text-xs font-semibold uppercase leading-4 tracking-wider text-gray-200">
										{isComponentReady ? value.category : <Skeleton duration={2} width={128} height={16} />}
									</h3>

									<div className="my-3" role="group">
										{value.links ? (
											value.links.map((value2) => {
												return value2.slug !== "go-back-to-sites" ? (
													<Link key={value2.slug} href={value2.url} passHref>
														<a
															className={classnames(
																"group mt-1 flex items-center justify-between  rounded-md px-3 py-2 text-sm font-medium leading-5 ",
																asPath.includes(value2.url) && isComponentReady ? "!cursor-default bg-gray-1100" : null,
																asPath.includes(value2.url) ||
																	(asPath.includes(SitesSlug) && SitesSlug.includes(value2.url))
																	? "text-gray-100"
																	: "text-gray-400",
																isComponentReady
																	? "cursor-pointer transition duration-150 ease-in-out hover:bg-gray-1100 hover:text-gray-100 focus:bg-gray-1100 focus:outline-none"
																	: "cursor-default"
															)}
														>
															<span className="flex items-center justify-start">
																{value2.slug === "sites" ? (
																	isComponentReady ? (
																		<ExternalLinkIcon className="mr-3 h-6 w-5" />
																	) : (
																		<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																	)
																) : value2.slug === "audit-logs" ? (
																	isComponentReady ? (
																		<DocumentReportIcon className="mr-3 h-6 w-5" />
																	) : (
																		<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																	)
																) : null}

																{value2.title ? (
																	<span>
																		{isComponentReady ? (
																			value2.title
																		) : (
																			<Skeleton duration={2} width={128} height={20} />
																		)}
																	</span>
																) : null}
															</span>

															{value2.slug === "sites" ? (
																isComponentReady ? (
																	sitesCount > 0 ? (
																		<span className="ml-auto inline-block rounded-full bg-white py-1 px-3 text-xs leading-4 text-black">
																			{sitesCount}
																		</span>
																	) : null
																) : (
																	<span className="flex items-center pl-3">
																		<Skeleton duration={2} width={30} height={20} className="rounded-full" />
																	</span>
																)
															) : null}
														</a>
													</Link>
												) : (
													<Link key={value.slug} href={value2.url} passHref>
														<a
															className={classnames(
																"group mt-1 flex items-center rounded-md py-2 text-sm font-medium leading-5 text-gray-400 hover:text-gray-100 focus:text-white focus:outline-none",
																isComponentReady ? "cursor-pointer" : null
															)}
														>
															{isComponentReady ? (
																<ArrowLeftIcon className="mr-3 h-6 w-5" />
															) : (
																<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
															)}

															{value2.title ? (
																<span>
																	{isComponentReady ? value2.title : <Skeleton duration={2} width={128} height={20} />}
																</span>
															) : null}
														</a>
													</Link>
												);
											})
										) : (
											<MemoizedSiteSelect />
										)}
									</div>
								</div>
							);
						}) ?? null}
					</nav>
				) : null}
			</div>
		</Scrollbars>
	);
};

/**
 * Memoized custom `PrimaryMenu` component
 */
export const MemoizedPrimaryMenu = memo(PrimaryMenu);

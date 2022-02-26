import { MemoizedSiteSelect } from "@components/select/SiteSelect";
import { SiteLogoWhite } from "@components/svgs/SiteLogo";
import { AuthAppLogo } from "@constants/GlobalValues";
import { AddNewSiteSlug, DashboardSitesLink, SitesSlug } from "@constants/PageLinks";
import { SidebarMenus } from "@constants/SidebarMenus";
import { DocumentReportIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useSites } from "@hooks/useSites";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classNames } from "@utils/classNames";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useContext } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
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
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser();
	const { sitesCount, validatingSites } = useSites();

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
					<div className="flex flex-1 flex-col overflow-y-auto">
						<nav className="flex-1 px-4">
							{PrimarySidebarMenus.filter((e) => {
								return !asPath?.includes(DashboardSitesLink + AddNewSiteSlug) ? e.slug !== "navigation" : true;
							})?.map((value) => {
								return (
									<div key={value.slug} className="mb-4">
										<h3 className="mt-8 inline-block text-xs font-semibold uppercase leading-4 tracking-wider text-gray-200">
											{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
												value.category
											) : (
												<Skeleton duration={2} width={128} height={16} />
											)}
										</h3>

										<div className="my-3" role="group">
											{value.links ? (
												value.links.map((value2) => {
													return value2.slug !== "go-back-to-sites" ? (
														<Link key={value2.slug} href={value2.url} passHref>
															<a
																className={classNames(
																	"group mt-1 flex items-center justify-between  rounded-md px-3 py-2 text-sm font-medium leading-5 ",
																	asPath.includes(value2.url) &&
																		isComponentReady &&
																		user &&
																		Math.round(user?.status / 100) === 2 &&
																		!user?.data?.detail
																		? "!cursor-default bg-gray-1100"
																		: null,
																	asPath.includes(value2.url) ||
																		(asPath.includes(SitesSlug) && SitesSlug.includes(value2.url))
																		? "text-gray-100"
																		: "text-gray-400",
																	isComponentReady &&
																		user &&
																		Math.round(user?.status / 100) === 2 &&
																		!user?.data?.detail
																		? "cursor-pointer transition duration-150 ease-in-out hover:bg-gray-1100 hover:text-gray-100 focus:bg-gray-1100 focus:outline-none"
																		: "cursor-default"
																)}
															>
																<span className="flex items-center justify-start">
																	{value2.slug === "sites" ? (
																		isComponentReady &&
																		user &&
																		Math.round(user?.status / 100) === 2 &&
																		!user?.data?.detail ? (
																			<ExternalLinkIcon className="mr-3 h-6 w-5" />
																		) : (
																			<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																		)
																	) : value2.slug === "audit-logs" ? (
																		isComponentReady &&
																		user &&
																		Math.round(user?.status / 100) === 2 &&
																		!user?.data?.detail ? (
																			<DocumentReportIcon className="mr-3 h-6 w-5" />
																		) : (
																			<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																		)
																	) : null}

																	{value2.title ? (
																		<span>
																			{isComponentReady &&
																			user &&
																			Math.round(user?.status / 100) === 2 &&
																			!user?.data?.detail ? (
																				value2.title
																			) : (
																				<Skeleton duration={2} width={128} height={20} />
																			)}
																		</span>
																	) : null}
																</span>

																{value2.slug === "sites" ? (
																	isComponentReady &&
																	user &&
																	Math.round(user?.status / 100) === 2 &&
																	!user?.data?.detail ? (
																		!validatingSites && sitesCount > 0 ? (
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
																className={classNames(
																	"group mt-1 flex items-center rounded-md py-2 text-sm font-medium leading-5 text-gray-400 hover:text-gray-100 focus:text-white focus:outline-none",
																	isComponentReady &&
																		user &&
																		Math.round(user?.status / 100) === 2 &&
																		!user?.data?.detail
																		? "cursor-pointer"
																		: null
																)}
															>
																{isComponentReady &&
																user &&
																Math.round(user?.status / 100) === 2 &&
																!user?.data?.detail ? (
																	<ArrowLeftIcon className="mr-3 h-6 w-5" />
																) : (
																	<Skeleton duration={2} width={20} height={20} circle={true} className="mr-3" />
																)}

																{value2.title ? (
																	<span>
																		{isComponentReady &&
																		user &&
																		Math.round(user?.status / 100) === 2 &&
																		!user?.data?.detail ? (
																			value2.title
																		) : (
																			<Skeleton duration={2} width={128} height={20} />
																		)}
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
					</div>
				) : null}
			</div>
		</Scrollbars>
	);
};

/**
 * Memoized custom `PrimaryMenu` component
 */
export const MemoizedPrimaryMenu = memo(PrimaryMenu);

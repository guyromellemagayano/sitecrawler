import { MemoizedSitesList } from "@components/lists/SitesList";
import { MemoizedSiteLimitReachedModal } from "@components/modals/SiteLimitReachedModal";
import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { MaxTotalSitesLimit, orderingByNameQuery, perPageQuery, sortByNameAscending } from "@constants/GlobalValues";
import { AddNewSiteLink } from "@constants/PageLinks";
import { SidebarMenuLabels } from "@constants/SidebarMenuLabels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useSites } from "@hooks/useSites";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef, memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `SiteSelectDropdown` component
 *
 * @param {boolean} openDropdown
 */
const SiteSelectDropdown = ({ openDropdown = false }, ref) => {
	// Sidebar Menu Labels
	const labelsArray = SidebarMenuLabels();

	// Router
	const { push } = useRouter();

	// Translations
	const { t } = useTranslation("sites");
	const addNewSite = t("addNewSite");

	// Custom context
	const { isComponentReady, user, hasSiteLimitReached } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { sites } = useSites(
		SitesApiEndpoint + `?${orderingByNameQuery + sortByNameAscending}&${perPageQuery + MaxTotalSitesLimit}`
	);

	// Custom hooks
	const {
		ref: siteLimitRef,
		isComponentVisible: isSiteLimitComponentVisible,
		setIsComponentVisible: setIsSiteLimitComponentVisible
	} = useComponentVisible(false);

	return (
		<>
			<MemoizedSiteLimitReachedModal
				ref={siteLimitRef}
				showModal={isSiteLimitComponentVisible}
				setShowModal={setIsSiteLimitComponentVisible}
			/>

			<Transition
				show={openDropdown}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<div ref={ref} className="absolute z-50 mt-1 w-full overflow-hidden rounded-md bg-white shadow-lg">
					<MemoizedSitesList openDropdown={openDropdown} sites={sites} />

					<span className="relative m-2 flex justify-center rounded-md shadow-sm">
						{isComponentReady ? (
							hasSiteLimitReached ? (
								<button
									type="button"
									className="flex w-full cursor-pointer items-center justify-center rounded-md border border-transparent bg-yellow-600 px-3 py-2 text-sm font-medium leading-4 text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 active:bg-yellow-700"
									onClick={(e) => setIsSiteLimitComponentVisible(!isSiteLimitComponentVisible)}
								>
									<div className="flex items-center space-x-2">
										<FontAwesomeIcon icon={["fas", "crown"]} className="h-4 w-4" />
										<span>{addNewSite}</span>
									</div>
								</button>
							) : (
								<Link href={AddNewSiteLink + "?step=1&edit=false&verified=false"} passHref>
									<a className="flex w-full cursor-pointer items-center justify-center rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium leading-4 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:bg-green-700">
										<div className="flex items-center space-x-2">
											<PlusIcon className="mr-2 h-4 w-4" aria-hidden="true" />
											{labelsArray[2]?.label ?? null}
										</div>
									</a>
								</Link>
							)
						) : (
							<Skeleton duration={2} width={208} height={38} className="rounded-md" />
						)}
					</span>
				</div>
			</Transition>
		</>
	);
};

/**
 * Memoized custom `SiteSelectDropdown` component
 */
const ForwardRefSiteSelectDropdown = forwardRef(SiteSelectDropdown);
export const MemoizedSiteSelectDropdown = memo(ForwardRefSiteSelectDropdown);

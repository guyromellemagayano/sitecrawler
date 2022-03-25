import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `IssuesStats` component
 */
const IssuesStats = () => {
	// Translations
	const { t } = useTranslation();
	const issuesText = t("sites:issues");
	const totalIssuesText = t("sites:totalIssues");
	const totalLinkIssuesText = t("sites:totalLinkIssues");
	const totalPageIssuesText = t("sites:totalPageIssues");
	const totalImageIssuesText = t("sites:totalImageIssues");

	// Custom context
	const { isComponentReady, stats, user, siteId, isCrawlFinished, isCrawlStarted, scan } =
		useContext(SiteCrawlerAppContext);

	// Custom variables
	const linkErrors = stats?.data?.num_non_ok_links;
	const pageErrors = stats?.data?.num_pages_big + stats?.data?.num_pages_tls_non_ok;
	const imageErrors = stats?.data?.num_non_ok_images;
	const totalErrors = linkErrors + pageErrors + imageErrors;

	const SectionTabs = [
		{
			title: isComponentReady && stats ? totalIssuesText : <Skeleton duration={2} width={72} height={20} />,
			count: isComponentReady && stats ? totalErrors : <Skeleton duration={2} width={108} height={36} />
		},
		{
			title: isComponentReady && stats ? totalLinkIssuesText : <Skeleton duration={2} width={72} height={20} />,
			count: isComponentReady && stats ? linkErrors : <Skeleton duration={2} width={108} height={36} />
		},
		{
			title: isComponentReady && stats ? totalPageIssuesText : <Skeleton duration={2} width={108} height={20} />,
			count: isComponentReady && stats ? pageErrors : <Skeleton duration={2} width={108} height={36} />
		},
		{
			title: isComponentReady && stats ? totalImageIssuesText : <Skeleton duration={2} width={108} height={20} />,
			count: isComponentReady && stats ? imageErrors : <Skeleton duration={2} width={108} height={36} />
		}
	];

	return (
		<div className="h-full overflow-hidden rounded-lg border">
			<div className="flex items-center px-6 pt-6 pb-2">
				{isComponentReady ? (
					<h2 className="text-lg font-bold leading-7 text-gray-900">{issuesText}</h2>
				) : (
					<Skeleton duration={2} width={100} height={15} />
				)}
			</div>

			<div className="px-6 pt-2 pb-4">
				<div className="col-span-4 grid grid-cols-1 sm:grid-cols-2">
					{SectionTabs.map((val, key) => {
						return (
							<div key={key} className="flex items-center justify-start py-4 sm:col-span-1">
								<div className="flex items-start justify-center">
									<dl>
										<dt className="truncate text-sm font-medium leading-5 text-gray-500 lg:text-sm">
											{isComponentReady ? val.title : <Skeleton duration={2} width={100} height={15}></Skeleton>}
										</dt>

										<dd
											className={classnames(
												"mt-1 text-3xl font-semibold leading-9 ",
												val.count > 0 ? "text-red-700" : val.count === 0 ? "text-green-700" : "text-gray-700"
											)}
										>
											{isComponentReady ? val.count : <Skeleton duration={2} width={100} height={36} />}
										</dd>
									</dl>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

/**
 * Memoized custom `IssuesStats` component
 */
export const MemoizedIssuesStats = memo(IssuesStats);

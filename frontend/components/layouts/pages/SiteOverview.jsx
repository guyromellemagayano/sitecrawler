import { MemoizedPageOption } from "@components/options/PageOption";
import { MemoizedCurrentStatusStats } from "@components/stats/CurrentStatus";
import { MemoizedImagesStats } from "@components/stats/Images";
import { MemoizedInformationStats } from "@components/stats/Information";
import { MemoizedIssuesStats } from "@components/stats/Issues";
import { MemoizedLinksStats } from "@components/stats/Links";
import { MemoizedOverviewStats } from "@components/stats/Overview";
import { MemoizedPagesStats } from "@components/stats/Pages";
import { MemoizedResponseTimeStats } from "@components/stats/ResponseTime";
import { MemoizedSeoStats } from "@components/stats/Seo";
import { MemoizedUptimeStats } from "@components/stats/Uptime";
import { memo } from "react";

/**
 * Custom function to render the `SiteOverviewPageLayout` component
 */
const SiteOverviewPageLayout = () => {
	return (
		<>
			<MemoizedPageOption isOverview />
			<div className="flex flex-auto flex-grow flex-col items-center justify-center p-4 focus:outline-none sm:px-6 md:px-0">
				<div className="h-full w-full flex-1 overflow-y-hidden py-2">
					<div className="mb-8 grid grid-flow-row grid-cols-1 gap-8 md:grid-cols-3">
						<div>
							<MemoizedOverviewStats />
						</div>
						<div>
							<MemoizedInformationStats />
						</div>
						<div>
							<MemoizedIssuesStats />
						</div>
					</div>

					<div className="mb-8 grid grid-flow-row grid-cols-1 gap-8 md:grid-cols-4">
						<div>
							<MemoizedLinksStats />
						</div>
						<div>
							<MemoizedPagesStats />
						</div>
						<div>
							<MemoizedImagesStats />
						</div>
						<div>
							<MemoizedSeoStats />
						</div>
					</div>

					<div className="mb-8 grid grid-flow-col grid-cols-4 gap-8">
						<MemoizedCurrentStatusStats />
						<MemoizedUptimeStats />
						<div className="col-span-3 row-span-2">
							<MemoizedResponseTimeStats />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

/**
 * Memoized custom `SiteOverviewPageLayout` component
 */
export const MemoizedSiteOverviewPageLayout = memo(SiteOverviewPageLayout);

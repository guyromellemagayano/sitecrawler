import { MemoizedSkeletonEntries } from "@components/skeletons/common/SkeletonEntries";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `UptimeResponseTimeStatsSkeleton` component
 */
const UptimeResponseTimeStatsSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<div className="flex h-[600px] w-full flex-col items-center">
			<div className="my-6">
				<Skeleton duration={2} width={1350} height={550} />
			</div>
		</div>
	);

	return <MemoizedSkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

/**
 * Memoized custom `UptimeResponseTimeStatsSkeleton` component
 */
export const MemoizedUptimeResponseTimeStatsSkeleton = memo(UptimeResponseTimeStatsSkeleton);

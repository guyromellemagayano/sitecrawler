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
		<div className="mx-auto flex justify-center px-5">
			<div className="mt-4 mb-8 flow-root w-full">
				{[...Array(2)].map((value, key) => (
					<span key={key}>
						<Skeleton height={500} />
						<Skeleton height={300} />
					</span>
				))}
			</div>
		</div>
	);

	return <MemoizedSkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

/**
 * Memoized custom `UptimeResponseTimeStatsSkeleton` component
 */
export const MemoizedUptimeResponseTimeStatsSkeleton = memo(UptimeResponseTimeStatsSkeleton);

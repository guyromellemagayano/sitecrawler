import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MemoizedSkeletonEntries } from "./common/SkeletonEntries";

/**
 * Custom function to render the `PaginationSkeleton` component
 */
const PaginationSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<div className="mt-8 mb-4 items-center justify-between bg-white py-4 align-middle lg:flex">
			<div className="flex flex-1">
				<Skeleton duration={2} width={120} />
			</div>
			<div className="space-x-3 md:flex">
				<Skeleton duration={2} width={80} />
				<div className="space-x-3 md:flex">
					<Skeleton duration={2} width={40} />
					<Skeleton duration={2} width={40} />
					<Skeleton duration={2} width={40} />
				</div>
				<Skeleton duration={2} width={80} />
			</div>
			<div className="flex flex-1 justify-end">
				<Skeleton duration={2} width={120} />
			</div>
		</div>
	);

	return <MemoizedSkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export const MemoizedPaginationSkeleton = memo(PaginationSkeleton);

import { MemoizedSkeletonEntries } from "@components/skeletons/common/SkeletonEntries";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `SeoStatsSkeleton` component
 */
const SeoStatsSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<div className="flex h-[720px] w-full flex-col items-center">
			<div className="my-6 flex justify-center">
				<Skeleton circle={true} duration={2} width={200} height={200} />
			</div>
			<div className="mt-8 flex flex-col space-y-3">
				{[...Array(9)].map((value, key) => (
					<span key={key} className="flex space-x-3">
						<Skeleton circle={true} width={20} height={20} />
						<Skeleton width={240} height={20} />
					</span>
				))}
			</div>
		</div>
	);

	return <MemoizedSkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

/**
 * Memoized custom `SeoStatsSkeleton` component
 */
export const MemoizedSeoStatsSkeleton = memo(SeoStatsSkeleton);

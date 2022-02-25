import { MemoizedSkeletonEntries } from "@components/skeletons/common/SkeletonEntries";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `HowToSetupSkeleton` component
 */
const HowToSetupSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<div className="w-full xl:max-w-screen-sm xl:flex-none xl:flex-grow-0">
			<div className="relative py-6 px-4 sm:px-6 lg:px-8 lg:py-0">
				<div className="mx-auto w-full max-w-7xl">
					<div className="mb-10 flex flex-col justify-center space-y-3">
						<span className="flex justify-center">
							<Skeleton duration={2} width={120} height={30} />
						</span>
						<span className="mx-auto mt-6 max-w-2xl sm:mt-4">
							<Skeleton duration={2} width={200} />
						</span>
					</div>
					<div className="mx-auto mb-12 flex w-full justify-center lg:max-w-md">
						<Skeleton duration={2} width={280} height={260} />
					</div>
					<div className="flex justify-center space-x-3">
						<Skeleton duration={2} width={100} />
						<Skeleton duration={2} width={100} />
					</div>
				</div>
			</div>
		</div>
	);

	return <MemoizedSkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export const MemoizedHowToSetupSkeleton = memo(HowToSetupSkeleton);

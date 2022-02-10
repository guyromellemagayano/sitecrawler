import { MemoizedSkeletonEntries } from "@components/skeletons/common/SkeletonEntries";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `HowToSetupSkeleton` component
 */
const HowToSetupSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<div tw="w-full xl:flex-grow-0 xl:flex-none xl:max-w-screen-sm">
			<div tw="relative py-6 px-4 sm:px-6 lg:px-8 lg:py-0">
				<div tw="max-w-7xl w-full mx-auto">
					<div tw="flex flex-col justify-center mb-10 space-y-3">
						<span tw="flex justify-center">
							<Skeleton duration={2} width={120} height={30} />
						</span>
						<span tw="mt-6 max-w-2xl mx-auto sm:mt-4">
							<Skeleton duration={2} width={200} />
						</span>
					</div>
					<div tw="flex justify-center mx-auto w-full lg:max-w-md mb-12">
						<Skeleton duration={2} width={280} height={260} />
					</div>
					<div tw="flex justify-center space-x-3">
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

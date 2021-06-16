// External
import "twin.macro";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";

// Components
const SkeletonEntries = loadable(() => import("src/components/skeletons/SkeletonEntries"));

const PaginationSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<div tw="relative py-6 px-4 sm:px-6 lg:px-8">
			<div tw="max-w-7xl mx-auto">
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
	);

	return <SkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default PaginationSkeleton;

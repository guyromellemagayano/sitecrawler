// External
// Components
import SkeletonEntries from "@components/skeletons/common/SkeletonEntries";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

const PaginationSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<div tw="bg-white px-4 mb-4 py-2 lg:flex items-center justify-between sm:px-6 align-middle">
			<div tw="flex-1 flex">
				<Skeleton duration={2} width={120} />
			</div>
			<div tw="md:flex space-x-3">
				<Skeleton duration={2} width={80} />
				<div tw="md:flex space-x-3">
					<Skeleton duration={2} width={40} />
					<Skeleton duration={2} width={40} />
					<Skeleton duration={2} width={40} />
				</div>
				<Skeleton duration={2} width={80} />
			</div>
			<div tw="flex-1 flex justify-end">
				<Skeleton duration={2} width={120} />
			</div>
		</div>
	);

	return <SkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default PaginationSkeleton;

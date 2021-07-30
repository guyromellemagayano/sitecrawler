// External
import "twin.macro";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";

// Components
const SkeletonEntries = loadable(() => import("@components"), {
	resolveComponent: (components) => components.SkeletonEntries
});

const PaginationSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<div tw="bg-white px-4 mb-4 py-2 lg:flex items-center justify-between sm:px-6 align-middle">
			<div tw="w-0 flex-1 flex">
				<Skeleton duration={2} width={120} />
			</div>
			<div tw="hidden md:flex">
				<Skeleton duration={2} width={280} />
			</div>
			<div tw="w-0 flex-1 flex justify-end">
				<Skeleton duration={2} width={120} />
			</div>
		</div>
	);

	return <SkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default PaginationSkeleton;

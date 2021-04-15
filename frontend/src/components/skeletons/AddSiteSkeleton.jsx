// External
import "twin.macro";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";

// Components
const SkeletonEntries = loadable(() => import("src/components/skeletons/SkeletonEntries"));

const AddSiteSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<div tw="flex justify-between w-full p-4">
			<Skeleton width={300} height={24} />
			<Skeleton width={150} height={24} />
		</div>
	);

	return <SkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default AddSiteSkeleton;

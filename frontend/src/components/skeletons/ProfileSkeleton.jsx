// External
import "twin.macro";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";

// Components
const SkeletonEntries = loadable(() => import("src/components/skeletons/SkeletonEntries"));

const ProfileSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<>
			<div tw="pt-4 px-8 sm:pt-8">
				<div tw="flex space-x-5 max-w-full pt-4 m-auto">
					<Skeleton duration={2} width={40} height={20} />
					<Skeleton duration={2} width={20} height={20} />
					<Skeleton duration={2} width={100} height={20} />
				</div>
				<div tw="max-w-full pt-12 m-auto">
					<Skeleton duration={2} width={150} height={30} />
				</div>
			</div>
		</>
	);

	return <SkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default ProfileSkeleton;

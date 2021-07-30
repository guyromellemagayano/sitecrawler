// External
import "twin.macro";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";

// Components
const SkeletonEntries = loadable(() => import("@components"), {
	resolveComponent: (components) => components.SkeletonEntries
});

const ProfileSidebarSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<div className="group" tw="p-4 flex-shrink-0 w-full block bg-gray-900">
			<div tw="flex items-center">
				<div>
					<Skeleton duration={2} width={130} />
					<Skeleton duration={2} width={130} />
				</div>
			</div>
		</div>
	);

	return <SkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default ProfileSidebarSkeleton;

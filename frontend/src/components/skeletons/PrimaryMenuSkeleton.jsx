// External
import "twin.macro";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";

// Components
const SkeletonEntries = loadable(() => import("@components"), {
	resolveComponent: (components) => components.SkeletonEntries
});

const PrimaryMenuSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<>
			<div tw="my-6">
				<span tw="mt-6">
					<Skeleton duration={2} width={125} height={20} />
				</span>

				<div tw="my-2">
					<span tw="mt-1 flex items-center py-2">
						<Skeleton duration={2} width={220} height={30} />
					</span>
				</div>
			</div>
			<div tw="my-6">
				<span tw="mt-6">
					<Skeleton duration={2} width={125} height={20} />
				</span>

				<div tw="my-2">
					<span tw="mt-1 flex items-center px-3 py-2 space-x-3">
						<Skeleton circle={true} duration={2} width={20} height={20} />
						<Skeleton duration={2} width={150} height={20} />
					</span>
				</div>
			</div>
		</>
	);

	return <SkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default PrimaryMenuSkeleton;

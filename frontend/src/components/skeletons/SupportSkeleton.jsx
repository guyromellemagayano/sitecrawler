// External
import "twin.macro";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";

// Components
const SkeletonEntries = loadable(() => import("src/components/skeletons/SkeletonEntries"));

const SiteAdditionStepsSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<div tw="max-w-full block p-8 pt-4">
			<div tw="max-w-full pb-4 m-auto">
				<div tw="my-6 max-w-sm">
					<div tw="mt-1 mb-1">
						<span tw="max-w-full mt-1 flex flex-col space-y-1">
							<Skeleton duration={2} width={150} height={20} />
							<Skeleton duration={2} width={600} height={140} />
						</span>
					</div>
				</div>

				<div tw="inline-flex w-full justify-start">
					<span tw="space-x-3">
						<Skeleton duration={2} width={150} height={40} />
					</span>
				</div>
			</div>
		</div>
	);

	return <SkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default SiteAdditionStepsSkeleton;

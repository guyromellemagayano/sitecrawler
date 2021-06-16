// External
import "twin.macro";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";

// Components
const SkeletonEntries = loadable(() => import("src/components/skeletons/SkeletonEntries"));

const SupportFormSkeleton = () => {
	const skeletonLimit = 1;
	const skeletonEntry = (
		<>
			<div tw="max-w-full p-4">
				<div tw="pt-4 flex flex-col space-y-3 m-auto">
					<span>
						<Skeleton width={250} height={24} />
					</span>
					<span tw="max-w-full mt-2">
						<Skeleton width={500} height={24} />
					</span>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-4xl p-4 pt-0 pb-2">
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
		</>
	);

	return <SkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default SupportFormSkeleton;

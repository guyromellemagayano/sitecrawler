// External
import "twin.macro";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";

// Components
const SkeletonEntries = loadable(() => import("src/components/skeletons/SkeletonEntries"));

const SettingsTimestampSkeleton = () => {
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
			<div tw="max-w-full lg:max-w-3xl p-4 pt-0 pb-2">
				<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
					<div tw="sm:col-span-4">
						<div tw="inline-flex space-x-3 my-1 max-w-sm">
							<Skeleton duration={2} width={50} height={40} />
							<span tw="space-y-3">
								<Skeleton duration={2} width={125} height={15} />
								<Skeleton duration={2} width={250} height={15} />
							</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);

	return <SkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default SettingsTimestampSkeleton;

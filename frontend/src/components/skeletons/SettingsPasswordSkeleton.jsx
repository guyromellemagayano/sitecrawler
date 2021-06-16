// External
import "twin.macro";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";

// Components
const SkeletonEntries = loadable(() => import("src/components/skeletons/SkeletonEntries"));

const SettingsPasswordSkeleton = () => {
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
						<div tw="my-1 max-w-sm">
							<span tw="block">
								<Skeleton duration={2} width={100} height={20} />
							</span>
							<div tw="mt-1 mb-1">
								<span tw="max-w-full mt-1">
									<Skeleton duration={2} width={540} height={40} />
								</span>
							</div>
						</div>
					</div>
					<div tw="sm:col-span-4">
						<div tw="my-1 max-w-sm">
							<span tw="block">
								<Skeleton duration={2} width={100} height={20} />
							</span>
							<div tw="mt-1 mb-1">
								<span tw="max-w-full mt-1">
									<Skeleton duration={2} width={540} height={40} />
								</span>
							</div>
						</div>
					</div>
					<div tw="sm:col-span-4">
						<div tw="mt-4 inline-flex w-full justify-between">
							<Skeleton duration={2} width={150} height={40} />
						</div>
					</div>
				</div>
			</div>
		</>
	);

	return <SkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default SettingsPasswordSkeleton;

// External
import "twin.macro";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";

// Components
const SkeletonEntries = loadable(() => import("src/components/skeletons/SkeletonEntries"));

const ProfileSettingsSkeleton = () => {
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
					<span tw="max-w-full mt-2 block">
						<Skeleton duration={2} width={300} height={20} />
					</span>
				</div>
			</div>
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

					<div tw="mt-6 inline-flex w-full justify-start">
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

export default ProfileSettingsSkeleton;

// External
// Components
import SkeletonEntries from "@components/skeletons/common/SkeletonEntries";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

const SiteAdditionStepsSkeleton = () => {
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
			<div tw="max-w-full p-8 pb-2">
				<div tw="space-y-4 md:flex md:space-y-0 md:space-x-8">
					{[...Array(2)].map((value, key) => (
						<div key={key} tw="md:flex-1">
							<span tw="pl-4 py-2 flex flex-col md:pl-0 md:pt-4 md:pb-0">
								<Skeleton duration={2} width={320} height={15} />
								<span tw="mt-2 flex flex-col">
									<Skeleton duration={2} width={100} height={15} />
									<Skeleton duration={2} width={150} height={15} />
								</span>
							</span>
						</div>
					))}
				</div>
			</div>
			<div tw="max-w-full block pt-8 pb-12 px-8">
				<div tw="max-w-full py-4 m-auto">
					<div tw="block mb-12">
						<Skeleton duration={2} width={250} height={20} />
						<span tw="max-w-full mt-1 block">
							<Skeleton duration={2} width={400} height={20} />
						</span>
					</div>

					<div tw="my-6 max-w-sm">
						<div tw="mt-1 mb-1">
							<span tw="max-w-full mt-1">
								<Skeleton duration={2} width={600} height={40} />
							</span>
						</div>
					</div>

					<div tw="flex justify-between">
						{[...Array(2)].map((value, key) => (
							<div key={key} tw="my-6 max-w-sm">
								<span tw="block">
									<Skeleton duration={2} width={100} height={20} />
								</span>
								<div tw="mt-1 mb-1">
									<span tw="max-w-full mt-1">
										<Skeleton duration={2} width={400} height={40} />
									</span>
								</div>
							</div>
						))}
					</div>

					<div tw="mt-6 inline-flex w-full justify-between">
						<span tw="space-x-3">
							<Skeleton duration={2} width={150} height={40} />
							<Skeleton duration={2} width={150} height={40} />
						</span>
						<span tw="space-x-3">
							<Skeleton duration={2} width={150} height={40} />
							<Skeleton duration={2} width={150} height={40} />
						</span>
					</div>
				</div>
			</div>
		</>
	);

	return <SkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default SiteAdditionStepsSkeleton;

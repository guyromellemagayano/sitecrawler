// External
import "twin.macro";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";

// Components
const TableSkeletonEntries = loadable(() => import("src/components/skeletons/TableSkeletonEntries"));

const ImageTableSkeleton = () => {
	const skeletonLimit = 5;
	const skeletonEntry = (
		<>
			<td tw="flex-none px-6 py-4 whitespace-nowrap border-b border-gray-300">
				<span tw="flex items-center">
					<span>
						<span className="link-item" tw="text-sm leading-5 font-medium text-gray-900">
							<Skeleton width={300} duration={2} />
						</span>
						<span tw="flex justify-start leading-5 text-gray-500">
							<Skeleton duration={2} className="btn-detail" width={82.2} height={27} />
						</span>
					</span>
				</span>
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				<Skeleton duration={2} width={75} />
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				<Skeleton duration={2} width={55} />
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				<Skeleton duration={2} width={200} />
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				<Skeleton duration={2} width={45} />
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				<Skeleton duration={2} width={45} />
			</td>
		</>
	);

	return <TableSkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default ImageTableSkeleton;

// External
import "twin.macro";
import Skeleton from "react-loading-skeleton";

// Components
import TableSkeletonEntries from "@components/skeletons/common/TableSkeletonEntries";

const SeoTableSkeleton = () => {
	const skeletonLimit = 5;
	const skeletonEntry = (
		<>
			<td tw="flex-none px-6 py-4 whitespace-nowrap border-b border-gray-200">
				<span tw="flex items-center">
					<span>
						<span className="link-item" tw="text-sm leading-5 font-medium text-gray-900">
							<Skeleton width={300} duration={2} />
						</span>
						<span tw="flex justify-start leading-5 text-gray-500">
							<Skeleton duration={2} width={82.2} />
						</span>
					</span>
				</span>
			</td>
			<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-500 leading-5">
				<span className={`text-sm leading-5 text-gray-900`}>
					<Skeleton duration={2} width={250} />
				</span>
			</td>
			<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-500 leading-5">
				<Skeleton duration={2} width={45} />
			</td>
			<td
				className="icon-status"
				tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-green-500"
			>
				<Skeleton duration={2} width={45} />
			</td>
			<td
				className="icon-status"
				tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-red-500"
			>
				<Skeleton duration={2} width={45} />
			</td>
		</>
	);

	return <TableSkeletonEntries str={skeletonEntry} limit={skeletonLimit} />;
};

export default SeoTableSkeleton;

// External
import "twin.macro";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";

// Components
const TableSkeletonEntries = loadable(() => import("src/components/skeletons/TableSkeletonEntries"));

const PageTableSkeleton = () => {
	const skeletonLimit = 5;
	const skeletonEntry = (
		<>
			<td tw="flex-none px-6 py-4 whitespace-nowrap border-b border-gray-300">
				<div tw="flex flex-col justify-start">
					<div className="link-item" tw="text-sm leading-5 font-medium text-gray-900">
						<Skeleton duration={2} width={300} />
					</div>
					<div tw="flex justify-start leading-5 text-gray-500">
						<Skeleton duration={2} className="btn-detail" width={82.2} height={27} />
					</div>
				</div>
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				<Skeleton duration={2} width={100} />
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				<Skeleton duration={2} width={50} />
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				<Skeleton duration={2} width={30} />
			</td>
		</>
	);

	return (
		<>
			<style jsx>{`
				a,
				div {
					max-width: 100%;
					display: inline-block;
					clear: both;
				}
				td {
					& > div {
						max-width: 100%;
						display: block;

						& > div {
							max-width: 100%;
							display: block;
						}
					}
				}

				.btn-detail {
					display: inline-block;
					padding: 8px 10px;
					line-height: 1;
					font-size: 0.7rem;
					margin-top: 5px;
				}
			`}</style>

			<TableSkeletonEntries str={skeletonEntry} limit={skeletonLimit} />
		</>
	);
};

export default PageTableSkeleton;

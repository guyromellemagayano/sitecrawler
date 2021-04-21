// External
import "twin.macro";
import loadable from "@loadable/component";
import Skeleton from "react-loading-skeleton";

// Components
const TableSkeletonEntries = loadable(() => import("src/components/skeletons/TableSkeletonEntries"));

const SeoTableSkeleton = () => {
	const skeletonLimit = 5;
	const skeletonEntry = (
		<>
			<td tw="flex-none px-6 py-4 whitespace-nowrap border-b border-gray-300">
				<div tw="flex items-center">
					<div>
						<div className="link-item" tw="text-sm leading-5 font-medium text-gray-900">
							<Skeleton duration={2} width={300} />
						</div>
						<div tw="flex justify-start leading-5 text-gray-500">
							<Skeleton duration={2} className="btn-detail" width={82.2} height={27} />
						</div>
					</div>
				</div>
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				<div className={`text-sm leading-5 text-gray-900`}>
					<Skeleton duration={2} width={250} />
				</div>
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				<Skeleton duration={2} width={45} />
			</td>
			<td className="icon-status" tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-green-500">
				<Skeleton duration={2} width={45} />
			</td>
			<td className="icon-status" tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-red-500">
				<Skeleton duration={2} width={45} />
			</td>
		</>
	);

	return (
		<>
			<style jsx>{`
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
				.link-item {
					max-width: 100%;
					display: block;

					a {
						display: inline-block;
					}
				}

				.truncate-link {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					max-width: 7rem;
				}

				.icon-status {
					text-align: left;
					span {
						margin-left: auto;
						margin-right: auto;
						display: inline-block;
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

export default SeoTableSkeleton;

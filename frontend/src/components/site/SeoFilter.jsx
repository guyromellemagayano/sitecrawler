import "twin.macro";
import PropTypes from "prop-types";

const SeoFilter = ({
	onFilterChange,
	allFilter,
	noIssueFilter,
	noTitle,
	noDescription,
	noH1First,
	noH1Second,
	noH2First,
	noH2Second
}) => {
	const filterHandler = (e) => {
		onFilterChange(e);
	};

	return (
		<div tw="sticky z-50 top-0 pb-4 bg-white">
			<div tw="px-4 py-5 border border-gray-300 sm:px-6 bg-white rounded-lg lg:flex lg:justify-between">
				<div tw="-ml-4 lg:-mt-2 lg:flex items-center flex-wrap sm:flex-nowrap">
					<h4 tw="ml-4 mb-4 lg:mb-0 mt-2 mr-1 text-base leading-4 font-semibold text-gray-600">Filter</h4>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={filterHandler}
									checked={allFilter}
									value="all"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">All Pages</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={filterHandler}
									checked={noTitle}
									value="noTitle"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">Without Title</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={filterHandler}
									checked={noDescription}
									value="noDescription"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">Without Description</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={filterHandler}
									checked={noH1First}
									value="noH1First"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">Without First H1</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={filterHandler}
									checked={noH1Second}
									value="noH1Second"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">Without Second H1</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={filterHandler}
									checked={noH2First}
									value="noH2First"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">Without First H2</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={filterHandler}
									checked={noH2Second}
									value="noH2Second"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">Without Second H2</span>
							</label>
						</div>
					</div>
				</div>
				<div className={`lg:-mt-2 lg:flex items-center align-end justify-end flex-end flex-wrap sm:flex-nowrap`}>
					<div className={`mt-2`}>
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									tw="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
									onChange={filterHandler}
									checked={noIssueFilter}
									value="no-issues"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">No Issues</span>
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

SeoFilter.propTypes = {};

export default SeoFilter;

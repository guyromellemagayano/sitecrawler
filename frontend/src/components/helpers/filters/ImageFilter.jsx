import "twin.macro";
import PropTypes from "prop-types";

const ImageFilter = ({
	onFilterChange,
	allFilter,
	noIssueFilter,
	imageBrokenSecurityFilter,
	imageNotWorkingFilter
}) => {
	const filterHandler = (e) => {
		onFilterChange(e);
	};

	return (
		<div tw="sticky z-10 top-0 pb-4 bg-white">
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
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">All Images</span>
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
									checked={imageNotWorkingFilter}
									value="notWorking"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">Broken Images</span>
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
									checked={imageBrokenSecurityFilter}
									value="brokenSecurity"
								/>
								<span tw="ml-2 text-left text-xs leading-4 font-normal text-gray-500">Broken Security</span>
							</label>
						</div>
					</div>
				</div>
				<div tw="lg:-mt-2 lg:flex items-center justify-end flex-wrap sm:flex-nowrap">
					<div tw="mt-2">
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

ImageFilter.propTypes = {};

export default ImageFilter;

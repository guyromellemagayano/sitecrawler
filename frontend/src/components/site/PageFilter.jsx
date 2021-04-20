// External
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import tw from "twin.macro";
import PropTypes from "prop-types";

const PageFilter = ({ user, onFilterChange, allFilter, noIssueFilter, largePageSizeFilter, brokenSecurityFilter }) => {
	const filterHandler = (e) => {
		onFilterChange(e);
	};

	return (
		<div tw="sticky z-10 top-0 pb-4 bg-white">
			<div tw="px-4 py-5 border border-gray-300 sm:px-6 bg-white rounded-lg lg:flex lg:justify-between">
				<div tw="-ml-4 lg:-mt-2 lg:flex items-center flex-wrap sm:flex-nowrap">
					<span tw="ml-4 mb-4 lg:mb-0 mt-2 mr-1 flex items-center space-x-3">
						<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-yellow-600" />
						<h4 tw="text-base leading-4 font-semibold text-gray-600">Filter</h4>
					</span>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									disabled={
										user.permissions &&
										user.permissions !== undefined &&
										user.permissions.includes("can_see_images") &&
										user.permissions.includes("can_see_pages") &&
										user.permissions.includes("can_see_scripts") &&
										user.permissions.includes("can_see_stylesheets") &&
										user.permissions.includes("can_start_scan")
											? false
											: true
									}
									css={[
										tw`h-4 w-4 border-gray-300 rounded`,
										user.permissions &&
										user.permissions !== undefined &&
										user.permissions.includes("can_see_images") &&
										user.permissions.includes("can_see_pages") &&
										user.permissions.includes("can_see_scripts") &&
										user.permissions.includes("can_see_stylesheets") &&
										user.permissions.includes("can_start_scan")
											? tw`focus:ring-indigo-500 text-indigo-600`
											: tw`focus:ring-indigo-200 text-indigo-300`
									]}
									onChange={
										user.permissions &&
										user.permissions !== undefined &&
										user.permissions.includes("can_see_images") &&
										user.permissions.includes("can_see_pages") &&
										user.permissions.includes("can_see_scripts") &&
										user.permissions.includes("can_see_stylesheets") &&
										user.permissions.includes("can_start_scan")
											? filterHandler
											: null
									}
									checked={allFilter}
									value="all"
								/>
								<span
									css={[
										tw`ml-2 text-left text-xs leading-4 font-normal `,
										user.permissions &&
										user.permissions !== undefined &&
										user.permissions.includes("can_see_images") &&
										user.permissions.includes("can_see_pages") &&
										user.permissions.includes("can_see_scripts") &&
										user.permissions.includes("can_see_stylesheets") &&
										user.permissions.includes("can_start_scan")
											? tw`text-gray-500`
											: tw`text-gray-400`
									]}
								>
									All Pages
								</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									disabled={
										user.permissions &&
										user.permissions !== undefined &&
										user.permissions.includes("can_see_images") &&
										user.permissions.includes("can_see_pages") &&
										user.permissions.includes("can_see_scripts") &&
										user.permissions.includes("can_see_stylesheets") &&
										user.permissions.includes("can_start_scan")
											? false
											: true
									}
									css={[
										tw`h-4 w-4 border-gray-300 rounded`,
										user.permissions &&
										user.permissions !== undefined &&
										user.permissions.includes("can_see_images") &&
										user.permissions.includes("can_see_pages") &&
										user.permissions.includes("can_see_scripts") &&
										user.permissions.includes("can_see_stylesheets") &&
										user.permissions.includes("can_start_scan")
											? tw`focus:ring-indigo-500 text-indigo-600`
											: tw`focus:ring-indigo-200 text-indigo-300`
									]}
									onChange={
										user.permissions &&
										user.permissions !== undefined &&
										user.permissions.includes("can_see_images") &&
										user.permissions.includes("can_see_pages") &&
										user.permissions.includes("can_see_scripts") &&
										user.permissions.includes("can_see_stylesheets") &&
										user.permissions.includes("can_start_scan")
											? filterHandler
											: null
									}
									checked={largePageSizeFilter}
									value="pageLargePages"
								/>
								<span
									css={[
										tw`ml-2 text-left text-xs leading-4 font-normal `,
										user.permissions &&
										user.permissions !== undefined &&
										user.permissions.includes("can_see_images") &&
										user.permissions.includes("can_see_pages") &&
										user.permissions.includes("can_see_scripts") &&
										user.permissions.includes("can_see_stylesheets") &&
										user.permissions.includes("can_start_scan")
											? tw`text-gray-500`
											: tw`text-gray-400`
									]}
								>
									Large Page Size
								</span>
							</label>
						</div>
					</div>
					<div tw="ml-4 mt-2 mr-2">
						<div>
							<label tw="flex items-center">
								<input
									type="checkbox"
									disabled={
										user.permissions &&
										user.permissions !== undefined &&
										user.permissions.includes("can_see_images") &&
										user.permissions.includes("can_see_pages") &&
										user.permissions.includes("can_see_scripts") &&
										user.permissions.includes("can_see_stylesheets") &&
										user.permissions.includes("can_start_scan")
											? false
											: true
									}
									css={[
										tw`h-4 w-4 border-gray-300 rounded`,
										user.permissions &&
										user.permissions !== undefined &&
										user.permissions.includes("can_see_images") &&
										user.permissions.includes("can_see_pages") &&
										user.permissions.includes("can_see_scripts") &&
										user.permissions.includes("can_see_stylesheets") &&
										user.permissions.includes("can_start_scan")
											? tw`focus:ring-indigo-500 text-indigo-600`
											: tw`focus:ring-indigo-200 text-indigo-300`
									]}
									onChange={
										user.permissions &&
										user.permissions !== undefined &&
										user.permissions.includes("can_see_images") &&
										user.permissions.includes("can_see_pages") &&
										user.permissions.includes("can_see_scripts") &&
										user.permissions.includes("can_see_stylesheets") &&
										user.permissions.includes("can_start_scan")
											? filterHandler
											: null
									}
									checked={brokenSecurityFilter}
									value="pageBrokenSecurity"
								/>
								<span
									css={[
										tw`ml-2 text-left text-xs leading-4 font-normal `,
										user.permissions &&
										user.permissions !== undefined &&
										user.permissions.includes("can_see_images") &&
										user.permissions.includes("can_see_pages") &&
										user.permissions.includes("can_see_scripts") &&
										user.permissions.includes("can_see_stylesheets") &&
										user.permissions.includes("can_start_scan")
											? tw`text-gray-500`
											: tw`text-gray-400`
									]}
								>
									Broken Security
								</span>
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
									disabled={
										user.permissions &&
										user.permissions !== undefined &&
										user.permissions.includes("can_see_images") &&
										user.permissions.includes("can_see_pages") &&
										user.permissions.includes("can_see_scripts") &&
										user.permissions.includes("can_see_stylesheets") &&
										user.permissions.includes("can_start_scan")
											? false
											: true
									}
									css={[
										tw`h-4 w-4 border-gray-300 rounded`,
										user.permissions &&
										user.permissions !== undefined &&
										user.permissions.includes("can_see_images") &&
										user.permissions.includes("can_see_pages") &&
										user.permissions.includes("can_see_scripts") &&
										user.permissions.includes("can_see_stylesheets") &&
										user.permissions.includes("can_start_scan")
											? tw`focus:ring-indigo-500 text-indigo-600`
											: tw`focus:ring-indigo-200 text-indigo-300`
									]}
									onChange={
										user.permissions &&
										user.permissions !== undefined &&
										user.permissions.includes("can_see_images") &&
										user.permissions.includes("can_see_pages") &&
										user.permissions.includes("can_see_scripts") &&
										user.permissions.includes("can_see_stylesheets") &&
										user.permissions.includes("can_start_scan")
											? filterHandler
											: null
									}
									checked={noIssueFilter}
									value="no-issues"
								/>
								<span
									css={[
										tw`ml-2 text-left text-xs leading-4 font-normal `,
										user.permissions &&
										user.permissions !== undefined &&
										user.permissions.includes("can_see_images") &&
										user.permissions.includes("can_see_pages") &&
										user.permissions.includes("can_see_scripts") &&
										user.permissions.includes("can_see_stylesheets") &&
										user.permissions.includes("can_start_scan")
											? tw`text-gray-500`
											: tw`text-gray-400`
									]}
								>
									No Issues
								</span>
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

PageFilter.propTypes = {};

export default PageFilter;

import { useState } from 'react';
import tw from 'twin.macro';

const PageFilterDiv = styled.div``;

const PageFilter = ({
	onFilterChange,
	allFilter,
	noIssueFilter,
	largePageSizeFilter,
	brokenSecurityFilter
}) => {
	const filterHandler = (e) => {
		onFilterChange(e);
	};

	return (
		<PageFilterDiv className={`pb-4`}>
			<div
				className={`px-4 py-5 border-b border-gray-300 sm:px-6 bg-white rounded-lg sm:ring-1 ring-black ring-opacity-5lg:flex lg:justify-between`}
			>
				<div
					className={`-ml-4 lg:-mt-2 lg:flex items-center flex-start flex-wrap sm:flex-nowrap`}
				>
					<h4
						className={`ml-4 mb-4 lg:mb-0 mt-2 mr-1 text-base leading-4 font-semibold text-gray-600`}
					>
						Filter
					</h4>
					<div className={`ml-4 mt-2 mr-2`}>
						<div>
							<label className={`flex items-center`}>
								<input
									type="checkbox"
									className={`form-checkbox`}
									onChange={filterHandler}
									checked={allFilter}
									value="all"
								/>
								<span
									className={`ml-2 text-left text-xs leading-4 font-normal text-gray-500`}
								>
									All Pages
								</span>
							</label>
						</div>
					</div>
					<div className={`ml-4 mt-2 mr-2`}>
						<div>
							<label className={`flex items-center`}>
								<input
									type="checkbox"
									className={`form-checkbox`}
									onChange={filterHandler}
									checked={largePageSizeFilter}
									value="pageLargePages"
								/>
								<span
									className={`ml-2 text-left text-xs leading-4 font-normal text-gray-500`}
								>
									Large Page Size
								</span>
							</label>
						</div>
					</div>
					<div className={`ml-4 mt-2 mr-2`}>
						<div>
							<label className={`flex items-center`}>
								<input
									type="checkbox"
									className={`form-checkbox`}
									onChange={filterHandler}
									checked={brokenSecurityFilter}
									value="pageBrokenSecurity"
								/>
								<span
									className={`ml-2 text-left text-xs leading-4 font-normal text-gray-500`}
								>
									Broken Security
								</span>
							</label>
						</div>
					</div>
				</div>
				<div
					className={`lg:-mt-2 lg:flex items-center align-end justify-end flex-end flex-wrap sm:flex-nowrap`}
				>
					<div className={`mt-2`}>
						<div>
							<label className={`flex items-center`}>
								<input
									type="checkbox"
									className={`form-checkbox`}
									onChange={filterHandler}
									checked={noIssueFilter}
									value="no-issues"
								/>
								<span
									className={`ml-2 text-left text-xs leading-4 font-normal text-gray-500`}
								>
									No Issues
								</span>
							</label>
						</div>
					</div>
				</div>
			</div>
		</PageFilterDiv>
	);
};

export default PageFilter;

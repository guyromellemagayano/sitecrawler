import { useState } from 'react';
import styled from 'styled-components';

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
				className={`bg-white px-4 py-5 border-b border-gray-300 sm:px-6 rounded-lg sm:shadow-xs`}
			>
				<div
					className={`-ml-4 lg:-mt-2 lg:flex items-center flex-start flex-wrap sm:flex-no-wrap`}
				>
					<h4
						className={`ml-3 mb-4 lg:mb-0 mt-1 mr-1 text-md leading-4 font-semibold text-gray-600`}
					>
						Filter
					</h4>
					<div className={`ml-4 mt-2 mr-2`}>
						<div>
							<label className={`flex items-center`}>
								<input
									type='checkbox'
									className={`form-checkbox`}
									onChange={filterHandler}
									checked={allFilter}
									value='all'
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
									type='checkbox'
									className={`form-checkbox`}
									onChange={filterHandler}
									checked={noIssueFilter}
									value='no-issues'
								/>
								<span
									className={`ml-2 text-left text-xs leading-4 font-normal text-gray-500`}
								>
									Pages with No Issues
								</span>
							</label>
						</div>
					</div>
					<div className={`ml-4 mt-2 mr-2`}>
						<div>
							<label className={`flex items-center`}>
								<input
									type='checkbox'
									className={`form-checkbox`}
									onChange={filterHandler}
									checked={largePageSizeFilter}
									value='pageLargePages'
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
									type='checkbox'
									className={`form-checkbox`}
									onChange={filterHandler}
									checked={brokenSecurityFilter}
									value='pageBrokenSecurity'
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
			</div>
		</PageFilterDiv>
	);
};

export default PageFilter;

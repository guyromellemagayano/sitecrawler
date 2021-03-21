import { useState } from 'react';
import tw from 'twin.macro';

const ImageFilterDiv = styled.div``;

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
		<ImageFilterDiv className={`pb-4`}>
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
									All Images
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
									checked={imageNotWorkingFilter}
									value="notWorking"
								/>
								<span
									className={`ml-2 text-left text-xs leading-4 font-normal text-gray-500`}
								>
									Broken Images
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
									checked={imageBrokenSecurityFilter}
									value="brokenSecurity"
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
		</ImageFilterDiv>
	);
};

export default ImageFilter;

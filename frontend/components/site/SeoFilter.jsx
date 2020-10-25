import { useState } from 'react';
import styled from 'styled-components';

const SeoFilterDiv = styled.div``;

const SeoFilter = ({
	onFilterChange,
	allFilter,
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
		<SeoFilterDiv className={`pb-4`}>
			<div
				className={`bg-white px-4 py-5 border-b border-gray-300 sm:px-6 bg-white rounded-lg sm:shadow-xs`}
			>
				<div
					className={`-ml-4 -mt-2 flex items-center flex-start flex-wrap sm:flex-no-wrap`}
				>
					<h4
						className={`ml-3 mt-1 mr-1 text-md leading-4 font-semibold text-gray-600`}
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
									checked={noTitle}
									value='noTitle'
								/>
								<span
									className={`ml-2 text-left text-xs leading-4 font-normal text-gray-500`}
								>
									Without Title
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
									checked={noDescription}
									value='noDescription'
								/>
								<span
									className={`ml-2 text-left text-xs leading-4 font-normal text-gray-500`}
								>
									Without Description
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
									checked={noH1First}
									value='noH1First'
								/>
								<span
									className={`ml-2 text-left text-xs leading-4 font-normal text-gray-500`}
								>
									Without First H1
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
									checked={noH1Second}
									value='noH1Second'
								/>
								<span
									className={`ml-2 text-left text-xs leading-4 font-normal text-gray-500`}
								>
									Without Second H1
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
									checked={noH2First}
									value='noH2First'
								/>
								<span
									className={`ml-2 text-left text-xs leading-4 font-normal text-gray-500`}
								>
									Without First H2
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
									checked={noH2Second}
									value='noH2Second'
								/>
								<span
									className={`ml-2 text-left text-xs leading-4 font-normal text-gray-500`}
								>
									Without Second H2
								</span>
							</label>
						</div>
					</div>
				</div>
			</div>
		</SeoFilterDiv>
	);
};

export default SeoFilter;

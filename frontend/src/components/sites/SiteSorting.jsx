// React
import React from 'react';

// External

import PropTypes from 'prop-types';
import styled from 'styled-components';

// Components
import Sorting from 'src/components/site/Sorting';

const SiteSortingDiv = styled.div``;

const SiteSorting = ({ sortOrder, onSortHandler, slug }) => {
	return (
		<SiteSortingDiv className="flex flex-row mr-3">
			<div className="inline-flex">
				{slug === 'site-name' ? (
					<Sorting
						direction={sortOrder.siteName}
						onSortHandler={onSortHandler}
						slug={slug}
					/>
				) : slug === 'last-crawled' ? (
					<Sorting
						direction={sortOrder.lastCrawled}
						onSortHandler={onSortHandler}
						slug={slug}
					/>
				) : (
					''
				)}
			</div>
		</SiteSortingDiv>
	);
};

SiteSorting.propTypes = {
	sortOrder: PropTypes.array,
	onSortHandler: PropTypes.func,
	slug: PropTypes.string
};

export default SiteSorting;

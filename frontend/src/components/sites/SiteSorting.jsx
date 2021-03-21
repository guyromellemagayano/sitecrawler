// React

// External
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import tw from 'twin.macro';

// Components
const Sorting = loadable(() => import('src/components/site/Sorting'));

const SiteSorting = ({ sortOrder, onSortHandler, slug }) => {
	return (
		<div tw='flex flex-row mr-3'>
			<div tw='inline-flex'>
				{slug === 'site-name' ? (
					<Sorting direction={sortOrder.siteName} onSortHandler={onSortHandler} slug={slug} />
				) : slug === 'last-crawled' ? (
					<Sorting direction={sortOrder.lastCrawled} onSortHandler={onSortHandler} slug={slug} />
				) : (
					''
				)}
			</div>
		</div>
	);
};

SiteSorting.propTypes = {};

export default SiteSorting;

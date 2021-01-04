import styled from 'styled-components';
import Sorting from 'components/site/Sorting';

const SiteSortingDiv = styled.div``;

const SiteSorting = (props) => {
	return (
		<SiteSortingDiv className='flex flex-row mr-3'>
			<div className={`inline-flex`}>
				{props.slug == 'site-name' ? (
					<Sorting
						direction={props.sortOrder.siteName}
						onSortHandler={props.onSortHandler}
						slug={props.slug}
					/>
				) : props.slug == 'last-crawled' ? (
					<Sorting
						direction={props.sortOrder.lastCrawled}
						onSortHandler={props.onSortHandler}
						slug={props.slug}
					/>
				) : (
					''
				)}
			</div>
		</SiteSortingDiv>
	);
};

export default SiteSorting;

import tw from 'twin.macro';
import Sorting from 'components/site/Sorting';

const LinkSortingDiv = styled.div``;

const LinkSorting = (props) => {
	return (
		<LinkSortingDiv className="flex flex-row mr-3">
			<div className={`inline-flex`}>
				{props.slug == 'link-url' ? (
					<Sorting
						direction={props.sortOrder.linkUrl}
						onSortHandler={props.onSortHandler}
						slug={props.slug}
					/>
				) : props.slug == 'url-type' ? (
					<Sorting
						direction={props.sortOrder.urlType}
						onSortHandler={props.onSortHandler}
						slug={props.slug}
					/>
				) : props.slug == 'status' ? (
					<Sorting
						direction={props.sortOrder.status}
						onSortHandler={props.onSortHandler}
						slug={props.slug}
					/>
				) : props.slug == 'http-code' ? (
					<Sorting
						direction={props.sortOrder.httpCode}
						onSortHandler={props.onSortHandler}
						slug={props.slug}
					/>
				) : props.slug == 'occurrences' ? (
					<Sorting
						direction={props.sortOrder.occurrences}
						onSortHandler={props.onSortHandler}
						slug={props.slug}
					/>
				) : (
					''
				)}
			</div>
		</LinkSortingDiv>
	);
};

export default LinkSorting;

// External
import tw from "twin.macro";
import PropTypes from "prop-types";

const Sorting = ({ enabled, direction, onSortHandler, slug }) => {
	return enabled ? (
		<>
			<button onClick={(e) => onSortHandler(slug, "asc")}>
				<span
					className="asc"
					css={[tw`w-4 h-4 inline-block`, direction == "asc" ? tw`text-gray-500` : tw`text-gray-300`]}
				>
					<svg
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path d="M5 15l7-7 7 7"></path>
					</svg>
				</span>
			</button>
			<button onClick={(e) => onSortHandler(slug, "desc")}>
				<span
					className="desc"
					css={[tw`w-4 h-4 inline-block`, direction == "desc" ? tw`text-gray-500` : tw`text-gray-300`]}
				>
					<svg
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path d="M19 9l-7 7-7-7"></path>
					</svg>
				</span>
			</button>
		</>
	) : (
		<>
			<button disabled={true} tw="cursor-default">
				<span
					className="asc"
					css={[tw`w-4 h-4 inline-block`, direction == "asc" ? tw`text-gray-500` : tw`text-gray-300`]}
				>
					<svg
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path d="M5 15l7-7 7 7"></path>
					</svg>
				</span>
			</button>
			<button disabled={true} tw="cursor-default">
				<span
					className="desc"
					css={[tw`w-4 h-4 inline-block`, direction == "desc" ? tw`text-gray-500` : tw`text-gray-300`]}
				>
					<svg
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path d="M19 9l-7 7-7-7"></path>
					</svg>
				</span>
			</button>
		</>
	);
};

Sorting.propTypes = {};

export default Sorting;

import { createGlobalStyle } from "styled-components";
import tw from "twin.macro";

export const CustomStyles = createGlobalStyle`
	body {
		${tw`antialiased`}
	}

	tr {
		a,
		div {
			${tw`max-w-full inline-block clear-both`}
		}

		td {
			& > div {
				${tw`max-w-full block`}

				& > div {
					${tw`max-w-full block`}
				}
			}
		}
	}

	.link-item {
		${tw`max-w-full block`}

		a {
			${tw`inline-block clear-both`}
		}
	}

	.icon-status {
		${tw`text-left`}

		span {
			${tw`mx-auto inline-block`}
		}
	}

	.truncate {
		&-link,
		&-profile-text,
		&-breadcrumbs {
			${tw`truncate`}
		}

		&-link {
			max-width: 15rem;
		}

		&-profile-text {
			max-width: 12rem;
		}

		&-breadcrumbs {
			max-width: 30rem;
		}
	}

	.scroll-dark-bg {
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 3px;
	}

	.rc-pagination li {
		${tw`cursor-pointer flex items-center justify-center outline-none text-sm leading-5 -mt-4 pt-4 font-medium text-opacity-100`}
		color: rgba(160, 174, 192, var(--text-opacity));
	}

	.rc-pagination li:hover {
		color: rgba(74, 85, 104, var(--text-opacity));
	}

	.rc-pagination-item {
		${tw`w-10 h-10`}
	}

	.rc-pagination-item-active {
		border-top: 2px solid #667eea;
		color: #667eea !important;
	}

	.rc-pagination-item a {
		outline: none;
	}

	.rc-pagination-jump-next button:before,
	.rc-pagination-jump-prev button:before {
		${tw`block`}
		content: "...";
	}

	.rc-pagination-prev {
		${tw`mr-3`}
	}

	.rc-pagination-prev button:before {
		${tw`block`}
		content: "Previous";
	}

	.rc-pagination-next {
		${tw`ml-3`}
	}

	.status-indicator {
		${tw`block rounded-full`}
		flex: 0 0 0.85rem;
		max-width: 0.85rem;
		height: 0.85rem;

		&.error {
			&-1 {
				${tw`bg-green-1000`}
			}
			&-2 {
				${tw`bg-red-1000`}
			}
			&-3 {
				${tw`bg-red-1100`}
			}
			&-4 {
				${tw`bg-red-1200`}
			}
			&-5 {
				${tw`bg-blue-1000`}
			}
		}
	}

	.apexcharts-legend {
		${tw`!block !mx-auto max-w-xs`}
	}

	.apexcharts-legend-series {
		${tw`flex items-center outline-none cursor-pointer border-gray-1400 border border-solid`}
		padding-bottom: 10px;
		-webkit-tap-highlight-color: transparent;
	}

	.apexcharts-legend-series:last-child {
		${tw`border-none`}
	}

	.apexcharts-legend-text {
		${tw`flex items-center justify-between w-full`}
	}

	.apexcharts-legend-marker {
		margin-right: 10px !important;
	}

	.legend-val {
		${tw`text-gray-1300 font-semibold`}
	}

	.legend-text {
		margin-right: 10px;
	}

	.skeleton-wrapper {
		${tw`mb-5`}
	}

	.react-loading-skeleton {
		${tw`!rounded-md !relative`}
	}

	@media only screen and (max-width: 1600px) {
		td {
			min-width: 10rem;

			&:first-child {
				${tw`max-w-xs`}
			}
		}

		.min-width-adjust {
			min-width: 20rem;
		}
	}

	@media only screen and (max-width: 1400px) {
		td {
			&:first-child {
				${tw`max-w-xs`}
			}
		}
	}
`;

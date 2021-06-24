// React
import * as React from "react";

// External
import { createGlobalStyle } from "styled-components";
import tw, { GlobalStyles as BaseStyles } from "twin.macro";

const CustomStyles = createGlobalStyle`
	body {
		${tw`antialiased`}
	}

	tr {
		a,
		div {
			max-width: 100%;
			display: inline-block;
			clear: both;
		}

		td {
			& > div {
				max-width: 100%;
				display: block;

				& > div {
					max-width: 100%;
					display: block;
				}
			}
		}
	}

	.link-item {
		max-width: 100%;
		display: block;

		a {
			display: inline-block;
			clear: both;
		}
	}

	.icon-status {
		text-align: left;

		span {
			margin-left: auto;
			margin-right: auto;
			display: inline-block;
		}
	}

	.truncate {
		&-link,
		&-profile-text,
		&-breadcrumbs {
			${tw`truncate`}
		}

		&-link {
			max-width: 18rem;
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
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		--text-opacity: 1;
		color: #a0aec0;
		color: rgba(160, 174, 192, var(--text-opacity));
		outline: none;
		font-size: 0.875rem;
		line-height: 1.25rem;
		margin-top: -1rem;
		padding-top: 1rem;
		font-weight: 500;
	}

	.rc-pagination li:hover {
		color: rgba(74, 85, 104, var(--text-opacity));
	}

	.rc-pagination-item {
		width: 40px;
		height: 40px;
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
		content: "...";
		display: block;
	}

	.rc-pagination-prev {
		margin-right: 0.75rem;
	}

	.rc-pagination-prev button:before {
		content: "Previous";
		display: block;
	}

	.rc-pagination-next {
		margin-left: 0.75rem;
	}

	.status-indicator {
		display: block;
		flex: 0 0 0.85rem;
		max-width: 0.85rem;
		height: 0.85rem;
		border-radius: 50%;

		&.error {
			&-1 {
				background-color: #19b080;
			}
			&-2 {
				background-color: #ef2917;
			}
			&-3 {
				background-color: #ed5244;
			}
			&-4 {
				background-color: #bb4338;
			}
			&-5 {
				background-color: #2d99ff;
			}
		}
	}

	.apexcharts-legend {
		display: block !important;
		margin-left: auto !important;
		margin-right: auto !important;
		max-width: 16rem;
	}

	.apexcharts-legend-series {
		display: flex;
		align-items: center;
		border-bottom: 1px solid #e7efef;
		padding-bottom: 10px;
		outline: none;
		-webkit-tap-highlight-color: transparent;
		cursor: pointer;
	}

	.apexcharts-legend-series:last-child {
		border: none;
	}

	.apexcharts-legend-text {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.apexcharts-legend-marker {
		margin-right: 10px !important;
	}

	.legend-val {
		color: #1d2626;
		font-weight: 600;
	}

	.legend-text {
		margin-right: 10px;
	}

	.skeleton-wrapper {
		margin-bottom: 20px;
	}

	@media only screen and (max-width: 1600px) {
		td {
			min-width: 10rem;

			&:first-child {
				max-width: 20rem;
			}
		}

		.min-width-adjust {
			min-width: 15rem;
		}
	}

	@media only screen and (max-width: 1400px) {
		td {
			&:first-child {
				max-width: 15rem;
			}
		}
	}
`;

const GlobalStyles = () => (
	<>
		<BaseStyles />
		<CustomStyles />
	</>
);

export default GlobalStyles;

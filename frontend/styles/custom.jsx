import * as styled from "styled-components";
import tw from "twin.macro";

/**
 * Custom global styles
 */
export const CustomGlobalStyles = styled.createGlobalStyle`
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
`;

/**
 * Custom vendor styles
 */
export const CustomVendorStyles = styled.createGlobalStyle`
	.rc-pagination {
		${tw`flex text-gray-500`}

		li {
			${tw`cursor-pointer flex items-center justify-center outline-none text-sm leading-5 -mt-4 pt-4 font-medium text-opacity-100`}
			color: rgba(160, 174, 192, var(--text-opacity));

			&:hover {
				color: rgba(74, 85, 104, var(--text-opacity));
			}
		}

		&-item {
			${tw`w-10 h-10`}

			a {
				${tw`outline-none`}
			}

			&-active {
				border-top: 2px solid #667eea;
				color: #667eea !important;
			}
		}

		&-prev {
			${tw`mr-3`}

			button {
				&::before {
					${tw`block`}
					content: "Previous";
				}
			}
		}

		&-next {
			${tw`ml-3`}
		}

		&-jump {
			&-next,
			&-prev {
				button {
					&::before {
						${tw`block`}
						content: "...";
					}
				}
			}
		}
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

		&-text {
			${tw`flex items-center justify-between w-full`}
		}

		&-marker {
			${tw`mr-2.5`}
		}

		&-series {
			${tw`flex items-center outline-none cursor-pointer border-gray-1400 border border-solid`}
			padding-bottom: 10px;
			-webkit-tap-highlight-color: transparent;

			&::last-child {
				${tw`border-none`}
			}
		}
	}

	.legend {
		&-val {
			${tw`text-gray-1300 font-semibold`}
		}

		&-text {
			${tw`mr-2.5`}
		}
	}

	.react-loading-skeleton {
		${tw`!rounded-md !relative`}
	}
`;

/**
 * Custom transition styles
 */
export const CustomTransitionStyles = styled.createGlobalStyle`
	.mobile-sidebar {
		&-first-child {
			&-enter {
				${tw`transition-opacity ease-linear duration-300`}

				&-from {
					${tw`opacity-0`}
				}

				&-to {
					${tw`opacity-100`}
				}
			}

			&-leave {
				${tw`transition-opacity ease-linear duration-300`}

				&-from {
					${tw`opacity-100`}
				}

				&-to {
					${tw`opacity-0`}
				}
			}
		}

		&-second-child {
			&-enter {
				${tw`transition ease-in-out duration-300 transform`}

				&-from {
					${tw`-translate-x-full`}
				}

				&-to {
					${tw`translate-x-0`}
				}
			}

			&-leave {
				${tw`transition ease-in-out duration-300 transform`}

				&-from {
					${tw`translate-x-0`}
				}

				&-to {
					${tw`-translate-x-full`}
				}
			}
		}

		&-third-child {
			&-enter {
				${tw`ease-in-out duration-300`}

				&-from {
					${tw`opacity-0`}
				}

				&-to {
					${tw`opacity-100`}
				}
			}

			&-leave {
				${tw`ease-in-out duration-300`}

				&-from {
					${tw`opacity-100`}
				}

				&-to {
					${tw`opacity-0`}
				}
			}
		}
	}

	.profile-menu-dropdown,
	.site-select-dropdown {
		&-enter {
			${tw`transition ease-out duration-100`}

			&-from {
				${tw`transform opacity-0 scale-95`}
			}

			&-to {
				${tw`transform opacity-100 scale-100`}
			}
		}

		&-leave {
			${tw`transition ease-in duration-75`}

			&-from {
				${tw`transform opacity-100 scale-100`}
			}

			&-to {
				${tw`transform opacity-0 scale-95`}
			}
		}
	}

	.delete-user-account-modal,
	.delete-site-modal,
	.site-limit-reached-modal,
	.show-help-modal,
	.change-to-basic-modal,
	.new-active-plan-modal,
	.payment-method-modal,
	.site-verify-modal,
	.site-delete-modal {
		&-dialog {
			${tw`fixed z-50 inset-0 overflow-y-auto`}
			&-overlay {
				${tw`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity`}
			}
		}
	}

	.delete-user-account-modal,
	.delete-site-modal,
	.site-limit-reached-modal,
	.show-help-modal,
	.change-to-basic-modal,
	.new-active-plan-modal,
	.payment-method-modal,
	.site-verify-modal,
	.site-delete-modal {
		&-first-child {
			&-enter {
				${tw`ease-out duration-300`}

				&-from {
					${tw`opacity-0`}
				}

				&-to {
					${tw`opacity-100`}
				}
			}

			&-leave {
				${tw`ease-in duration-200`}

				&-from {
					${tw`opacity-100`}
				}

				&-to {
					${tw`opacity-0`}
				}
			}
		}

		&-second-child {
			&-enter {
				${tw`ease-out duration-300`}

				&-from {
					${tw`opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95`}
				}

				&-to {
					${tw`opacity-100 translate-y-0 sm:scale-100`}
				}
			}

			&-leave {
				${tw`ease-in duration-200`}

				&-from {
					${tw`opacity-100 translate-y-0 sm:scale-100`}
				}

				&-to {
					${tw`opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95`}
				}
			}
		}
	}

	.show-help-modal {
		&-second-child {
			&-title {
				${tw`text-lg font-bold leading-6 text-gray-900`}
			}

			&-description {
				${tw`mb-3 italic`}
			}
		}
	}

	.site-verify-modal {
		&-second-child {
			&-title {
				${tw`text-lg font-bold leading-6 text-gray-900`}
			}
		}
	}

	.notifications {
		&-enter {
			${tw`transform ease-out duration-300 transition`}

			&-from {
				${tw`translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2`}
			}

			&-to {
				${tw`translate-y-0 opacity-100 sm:translate-x-0`}
			}
		}

		&-leave {
			${tw`transition ease-in duration-100`}

			&-from {
				${tw`opacity-100`}
			}

			&-to {
				${tw`opacity-0`}
			}
		}
	}

	.alerts {
		&-enter {
			${tw`transition-opacity duration-75`}

			&-from {
				${tw`opacity-0`}
			}

			&-to {
				${tw`opacity-100`}
			}
		}

		&-leave {
			${tw`transition-opacity duration-150`}

			&-from {
				${tw`opacity-100`}
			}

			&-to {
				${tw`opacity-0`}
			}
		}
	}

	.pagination {
		${tw`flex`}
	}
`;

// React
import * as React from "react";

// External
import "twin.macro";
import { DocumentIcon, LinkIcon, PhotographIcon, InformationCircleIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import StatsLabel from "public/labels/components/sites/Stats.json";

const SitesStats = ({ stats, scanResult }) => {
	const [componentReady, setComponentReady] = React.useState(false);

	React.useEffect(() => {
		stats
			? (() => {
					setComponentReady(false);

					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;
	}, [stats]);

	const setLinkErrors = () => {
		let valLength = stats?.num_non_ok_links;

		return valLength;
	};

	const setSeoErrors = () => {
		let valLength =
			stats?.num_pages_without_title +
			stats?.num_pages_without_description +
			stats?.num_pages_without_h1_first +
			stats?.num_pages_without_h2_first;

		return valLength;
	};

	const setPageErrors = () => {
		let valLength = stats?.num_pages_big + stats?.num_pages_tls_non_ok;

		return valLength;
	};

	const setImageErrors = () => {
		let valLength = stats?.num_non_ok_images + stats?.num_images_with_missing_alts + stats?.num_images_tls_non_ok;

		return valLength;
	};

	const PageTabs = [
		{
			title: "Total Issues",
			count: componentReady ? (
				stats ? (
					setLinkErrors() + setSeoErrors() + setPageErrors() + setImageErrors()
				) : null
			) : (
				<Skeleton duration={2} width={50} height={50} />
			)
		},
		{
			title: "Total Pages",
			count: componentReady ? stats ? stats.num_pages : null : <Skeleton duration={2} width={50} height={50} />
		},
		{
			title: "Total Links",
			count: componentReady ? stats ? stats.num_links : null : <Skeleton duration={2} width={50} height={50} />
		},
		{
			title: "Total Images",
			count: componentReady ? stats ? stats.num_images : null : <Skeleton duration={2} width={50} height={50} />
		}
	];

	return (
		<div tw="px-6 py-5 sm:p-6 bg-white overflow-hidden rounded-lg border">
			<h2 tw="text-lg font-bold leading-7 text-gray-900">{StatsLabel[0].label}</h2>
			<div tw="grid grid-cols-2 h-full overflow-hidden py-6">
				{PageTabs.map((val, key) => {
					return (
						<div key={key} tw="flex items-center justify-start space-y-px space-x-px">
							<div tw="flex items-start justify-center">
								<dl tw="mr-2">
									<dt>
										{val.title === "Total Pages" ? (
											<DocumentIcon tw="mr-3 h-6 w-6 text-gray-500" />
										) : val.title === "Total Links" ? (
											<LinkIcon tw="mr-3 h-6 w-6 text-gray-500" />
										) : val.title === "Total Images" ? (
											<PhotographIcon tw="mr-3 h-6 w-6 text-gray-500" />
										) : (
											<InformationCircleIcon tw="mr-3 h-6 w-6 text-gray-500" />
										)}
									</dt>
								</dl>
								<dl>
									<dt tw="text-sm lg:text-sm leading-5 font-medium text-gray-500 truncate">{val.title}</dt>

									{val.title === "Total Issues" ? (
										<dd tw="mt-1 text-3xl leading-9 font-semibold text-red-700">{val.count}</dd>
									) : (
										<dd tw="mt-1 text-3xl leading-9 font-semibold text-gray-900">{val.count}</dd>
									)}
								</dl>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

SitesStats.propTypes = {};

export default SitesStats;

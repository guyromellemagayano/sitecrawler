// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DocumentTextIcon, PhotographIcon } from "@heroicons/react/outline";
import { SearchIcon, DownloadIcon, GlobeIcon, LinkIcon } from "@heroicons/react/solid";
import { styled } from "twin.macro";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import HeadingOptionsLabel from "./labels/HeadingOptions.json";

// Loadable
const UpgradeErrorModal = loadable(() => import("src/components/modals/UpgradeErrorModal"));

const HeadingOptionsDiv = styled.div``;

const HeadingOptions = ({
	isLinks,
	isPages,
	isImages,
	isSeo,
	siteId,
	siteName,
	siteUrl,
	scanObjId,
	permissions,
	pageTitle,
	count,
	dataLabel
}) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [showUpgradeErrorModal, setShowUpgradeErrorModal] = React.useState(false);
	const { asPath } = useRouter();

	React.useEffect(() => {
		(() => {
			setComponentReady(false);

			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		})();
	}, []);

	return (
		<HeadingOptionsDiv tw="pt-4 m-auto md:flex md:items-center md:justify-between">
			<UpgradeErrorModal show={showUpgradeErrorModal} setShowErrorModal={setShowUpgradeErrorModal} />

			<div tw="flex-1 min-w-0">
				<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{pageTitle}</h2>
				<div tw="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:mt-2 sm:space-x-6">
					<div tw="mt-2 flex items-center text-sm text-gray-500">
						<GlobeIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
						<a
							href={siteUrl}
							target="_blank"
							title={siteName}
							className="truncate-link"
							tw="max-w-2xl text-sm leading-6 font-semibold text-gray-500 hover:text-gray-900 truncate"
						>
							{siteName}
						</a>
					</div>

					<div tw="mt-2 flex items-center text-sm text-gray-500">
						{isLinks ? (
							<LinkIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
						) : isSeo ? (
							<SearchIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
						) : isPages ? (
							<DocumentTextIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
						) : isImages ? (
							<PhotographIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
						) : null}
						{(permissions?.includes("can_see_images") &&
							permissions?.includes("can_see_pages") &&
							permissions?.includes("can_see_scripts") &&
							permissions?.includes("can_see_stylesheets")) ||
						asPath.includes("links")
							? count > 1 && componentReady
								? count + " " + dataLabel[0]
								: count == 1 && componentReady
								? count + " " + dataLabel[1]
								: count == 0 && componentReady
								? dataLabel[2]
								: dataLabel[3]
							: HeadingOptionsLabel[1].label}
					</div>
				</div>
			</div>
			<div tw="mt-4 flex md:mt-0 md:ml-4">
				{componentReady ? (
					(permissions?.includes("can_see_images") &&
						permissions?.includes("can_see_pages") &&
						permissions?.includes("can_see_scripts") &&
						permissions?.includes("can_see_stylesheets")) ||
					asPath.includes("links") ? (
						!asPath.includes("seo") ? (
							<a
								href={`/api/site/${siteId}/scan/${scanObjId}/${
									isLinks ? "link" : isPages || isSeo ? "page" : isImages ? "image" : null
								}/?format=csv`}
								tw="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								<span tw="flex items-center space-x-2">
									<DownloadIcon tw="w-4 h-4 text-gray-700 mr-1" />
									{HeadingOptionsLabel[0].label}
								</span>
							</a>
						) : null
					) : (
						<button
							type="button"
							onClick={() => setShowUpgradeErrorModal(!showUpgradeErrorModal)}
							tw="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
						>
							<span tw="flex items-center space-x-2">
								<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />
								<span>{HeadingOptionsLabel[0].label}</span>
							</span>
						</button>
					)
				) : (
					<Skeleton duration={2} width={150} height={40} />
				)}
			</div>
		</HeadingOptionsDiv>
	);
};

HeadingOptions.propTypes = {};

export default HeadingOptions;

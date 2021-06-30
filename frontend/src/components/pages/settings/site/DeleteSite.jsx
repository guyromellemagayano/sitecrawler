// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import "twin.macro";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// Loadable
const DeleteSiteModal = loadable(() => import("src/components/modals/DeleteSiteModal"));

const DeleteSite = ({ user, siteId, settingsLabel, mutateSite }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [showModal, setShowModal] = React.useState(false);

	const router = useRouter();

	React.useEffect(() => {
		user && siteId
			? (() => {
					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;

		return setComponentReady(false);
	}, [user, siteId]);

	return (
		<div>
			<DeleteSiteModal
				showModal={showModal}
				setShowModal={setShowModal}
				mutateSite={mutateSite}
				router={router}
				siteId={siteId?.id}
			/>

			<div tw="max-w-full p-4">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{settingsLabel[9].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">{settingsLabel[10].label}</p>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-3xl p-4 pt-0 pb-2">
				<div tw="flex justify-start">
					<span tw="inline-flex rounded-md shadow-sm">
						{componentReady ? (
							<button
								type="button"
								id="siteDeleteModalButton"
								tw="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
								onClick={() => setShowModal(!showModal)}
							>
								{settingsLabel[12].label}
							</button>
						) : (
							<Skeleton duration={2} width={150} height={40} />
						)}
					</span>
				</div>
			</div>
		</div>
	);
};

DeleteSite.propTypes = {};

export default DeleteSite;

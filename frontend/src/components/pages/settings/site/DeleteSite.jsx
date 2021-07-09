// React
import * as React from "react";

// External
import tw from "twin.macro";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import DeleteSiteLabel from "./labels/DeleteSite.json";

// Loadable
const DeleteSiteModal = loadable(() => import("src/components/modals/DeleteSiteModal"));

const DeleteSite = (props) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [showDeleteSiteModal, setShowDeleteSiteModal] = React.useState(false);
	const [disableDeleteSiteAccountButton, setDisableDeleteSiteAccountButton] = React.useState(false);

	React.useEffect(() => {
		props.user && props.siteId
			? (() => {
					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;

		return setComponentReady(false);
	}, [props.user, props.siteId]);

	return (
		<div>
			<DeleteSiteModal
				showModal={showDeleteSiteModal}
				setShowModal={setShowDeleteSiteModal}
				mutateSite={props.mutateSite}
				siteId={props.siteId?.id}
			/>

			<div tw="max-w-full p-4">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{DeleteSiteLabel[0].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">{DeleteSiteLabel[1].label}</p>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-3xl p-4 pt-0 pb-2">
				<div tw="flex justify-start">
					<span tw="inline-flex rounded-md shadow-sm">
						{componentReady ? (
							<button
								type="button"
								disabled={disableDeleteSiteAccountButton}
								id="site_delete_modal_button"
								css={[
									tw`cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-red-600 text-sm leading-5 font-medium text-white shadow-sm sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ease-in-out duration-150`,
									disableDeleteSiteAccountButton
										? tw`opacity-50 cursor-not-allowed`
										: tw`hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 active:bg-red-700`
								]}
								onClick={() => setShowDeleteSiteModal(!showDeleteSiteModal)}
							>
								{disableDeleteSiteAccountButton ? DeleteSiteLabel[2].label : DeleteSiteLabel[0].label}
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

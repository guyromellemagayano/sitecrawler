// React
import "twin.macro";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// Enums
import { DeleteSiteLabels } from "@enums/DeleteSiteLabels";

// Hooks
import { useComponentVisible } from "@hooks/useComponentVisible";

// Components
import DeleteSiteModal from "@components/modals/DeleteSiteModal";

const DeleteSiteSettings = ({ componentReady, mutateSite, siteId }) => {
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	return (
		<div>
			<DeleteSiteModal
				mutateSite={mutateSite}
				ref={ref}
				setShowModal={setIsComponentVisible}
				showModal={isComponentVisible}
				siteId={siteId?.id}
			/>

			{/* TODO: Develop a separate component, settingsLabel */}
			<div tw="max-w-full p-4">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{DeleteSiteLabels[0].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">{DeleteSiteLabels[1].label}</p>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-3xl p-4 pt-0 pb-2">
				<div tw="flex justify-start">
					<span tw="inline-flex rounded-md shadow-sm">
						{componentReady ? (
							<button
								type="button"
								id="site-delete-modal-button"
								tw="cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-red-600 text-sm leading-5 font-medium text-white shadow-sm sm:text-sm sm:leading-5 transition ease-in-out duration-150 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 active:bg-red-700"
								onClick={() => setIsComponentVisible(!isComponentVisible)}
							>
								{DeleteSiteLabels[2].label}
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

DeleteSiteSettings.propTypes = {
	componentReady: PropTypes.bool,
	mutateSite: PropTypes.func,
	id: PropTypes.number
};

DeleteSiteSettings.defaultProps = {
	componentReady: false,
	mutateSite: null,
	id: null
};

export default DeleteSiteSettings;

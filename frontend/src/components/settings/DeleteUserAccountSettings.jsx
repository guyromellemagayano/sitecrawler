// React
import "twin.macro";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// Enums
import { DeleteUserAccountLabels } from "@enums/DeleteUserAccountLabels";

// Hooks
import { useComponentVisible } from "@hooks/useComponentVisible";

// Components
import DeleteUserAccountModal from "@components/modals/DeleteUserAccountModal";

const DeleteUserAccountSettings = ({ componentReady, mutateUser, user }) => {
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	return (
		<div>
			<DeleteUserAccountModal
				mutateUser={mutateUser}
				ref={ref}
				setShowModal={setIsComponentVisible}
				showModal={isComponentVisible}
				user={user}
			/>

			{/* TODO: Develop a separate component, settingsLabel */}
			<div tw="max-w-full p-4">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">
						{DeleteUserAccountLabels[0].label}
					</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">
						{DeleteUserAccountLabels[1].label}
					</p>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-3xl p-4 pt-0 pb-2">
				<div tw="flex justify-start">
					<span tw="inline-flex rounded-md shadow-sm">
						{componentReady ? (
							<button
								type="button"
								id="user-account-delete-modal-button"
								tw="
									cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-red-600 text-sm leading-5 font-medium text-white shadow-sm sm:text-sm sm:leading-5 transition ease-in-out duration-150 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 active:bg-red-700"
								onClick={() => setIsComponentVisible(!isComponentVisible)}
							>
								{DeleteUserAccountLabels[2].label}
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

DeleteUserAccountSettings.propTypes = {
	componentReady: PropTypes.bool,
	mutateUser: PropTypes.func,
	user: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

DeleteUserAccountSettings.defaultProps = {
	componentReady: false,
	mutateUser: null,
	user: null
};

export default DeleteUserAccountSettings;

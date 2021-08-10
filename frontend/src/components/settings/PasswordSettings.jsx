// React
import PropTypes from "prop-types";
import * as React from "react";

// External
import "twin.macro";

// Enums
import { PasswordSettingsLabels } from "@enums/PasswordSettingsLabels";

// Components
import ErrorMessageAlert from "@components/alerts/ErrorMessageAlert";
import PasswordSettingsForm from "@components/forms/PasswordSettingsForm";
import SuccessMessageAlert from "@components/alerts/SuccessMessageAlert";

const PasswordSettings = ({ componentReady, mutateUser }) => {
	const [errorMsg, setErrorMsg] = React.useState([]);
	const [successMsg, setSuccessMsg] = React.useState([]);

	return (
		<div>
			{errorMsg.length > 0
				? errorMsg.map((value, index) => <ErrorMessageAlert key={index} message={value} />)
				: null}

			{successMsg.length > 0
				? successMsg.map((value, index) => <SuccessMessageAlert key={index} message={value} />)
				: null}

			{/* TODO: Develop a separate component, settingsLabel */}
			<div tw="max-w-full p-4">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">
						{PasswordSettingsLabels[0].label}
					</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">
						{PasswordSettingsLabels[0].description}
					</p>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-3xl p-4 pt-0 pb-2">
				<PasswordSettingsForm
					componentReady={componentReady}
					setErrorMsg={setErrorMsg}
					setSuccessMsg={setSuccessMsg}
					mutateUser={mutateUser}
				/>
			</div>
		</div>
	);
};

PasswordSettings.propTypes = {
	componentReady: PropTypes.bool,
	mutateUser: PropTypes.func
};

PasswordSettings.defaultProps = {
	componentReady: false,
	mutateUser: null
};

export default PasswordSettings;

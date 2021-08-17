// React
import * as React from "react";

// External
import "twin.macro";
import PropTypes from "prop-types";

// Enums
import { GlobalSettingsLabels } from "@enums/GlobalSettingsLabels";

// Components
import ErrorMessageAlert from "@components/alerts/ErrorMessageAlert";
import SuccessMessageAlert from "@components/alerts/SuccessMessageAlert";
import TimestampSettingsForm from "@components/forms/TimestampSettingsForm";

const TimestampSettings = ({ componentReady, mutateUser, user }) => {
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
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{GlobalSettingsLabels[0].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">
						{GlobalSettingsLabels[0].description}
					</p>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-3xl p-4 pt-0 pb-2">
				<TimestampSettingsForm
					componentReady={componentReady}
					mutateUser={mutateUser}
					setErrorMsg={setErrorMsg}
					setSuccessMsg={setSuccessMsg}
					user={user}
				/>
			</div>
		</div>
	);
};

TimestampSettings.propTypes = {
	componentReady: PropTypes.bool,
	mutateUser: PropTypes.func,
	user: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

TimestampSettings.defaultProps = {
	componentReady: false,
	mutateUser: null,
	user: null
};

export default TimestampSettings;

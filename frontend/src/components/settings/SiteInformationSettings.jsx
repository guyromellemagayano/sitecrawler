// React
import * as React from "react";

// External
import PropTypes from "prop-types";
import "twin.macro";

// Enums
import { SettingsLabels } from "@enums/SettingsLabels";

// Components
import ErrorMessageAlert from "@components/alerts/ErrorMessageAlert";
import SiteInformationSettingsForm from "@components/forms/SiteInformationSettingsForm";
import SuccessMessageAlert from "@components/alerts/SuccessMessageAlert";

const SiteInformationSettings = ({ componentReady, mutateSite, mutateSiteId, siteId }) => {
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
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{SettingsLabels[0].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">
						{SettingsLabels[0].description}
					</p>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-3xl p-4 pt-0 pb-2">
				<SiteInformationSettingsForm
					componentReady={componentReady}
					mutateSite={mutateSite}
					mutateSiteId={mutateSiteId}
					setErrorMsg={setErrorMsg}
					setSuccessMsg={setSuccessMsg}
					siteId={siteId}
				/>
			</div>
		</div>
	);
};

SiteInformationSettings.propTypes = {
	componentReady: PropTypes.bool,
	mutateSite: PropTypes.func,
	mutateSiteId: PropTypes.func,
	siteId: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
};

SiteInformationSettings.defaultProps = {
	componentReady: false,
	mutateSite: null,
	mutateSiteId: null,
	siteId: null
};

export default SiteInformationSettings;

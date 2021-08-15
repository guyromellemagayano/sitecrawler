// React
import * as React from "react";

// External
import "twin.macro";
import PropTypes from "prop-types";

// Enums
import { GlobalSettingsLabels } from "@enums/GlobalSettingsLabels";
import { SiteApiEndpoint, UserApiEndpoint } from "@enums/ApiEndpoints";

// Components
import ErrorMessageAlert from "@components/alerts/ErrorMessageAlert";
import LargePageSizeSettingsForm from "@components/forms/LargePageSizeSettingsForm";
import SuccessMessageAlert from "@components/alerts/SuccessMessageAlert";

const LargePageSizeSettings = ({ componentReady, mutateSite, mutateSiteId, siteId, user }) => {
	const [endpoint, setEndpoint] = React.useState("");
	const [errorMsg, setErrorMsg] = React.useState([]);
	const [largePageSizeThreshold, setLargePageSizeThreshold] = React.useState(0);
	const [successMsg, setSuccessMsg] = React.useState([]);

	const siteIdApiEndpoint = `${SiteApiEndpoint + siteId?.id}/`;

	React.useEffect(() => {
		user && user?.large_page_size_threshold
			? (() => {
					siteId && siteId?.large_page_size_threshold
						? (() => {
								siteId?.large_page_size_threshold
									? (() => {
											setLargePageSizeThreshold(siteId?.large_page_size_threshold);
											setEndpoint(siteIdApiEndpoint);
									  })()
									: (() => {
											setLargePageSizeThreshold(user?.large_page_size_threshold);
											setEndpoint(siteIdApiEndpoint);
									  })();
						  })()
						: (() => {
								setLargePageSizeThreshold(user?.large_page_size_threshold);
								setEndpoint(UserApiEndpoint);
						  })();
			  })()
			: (() => {
					setLargePageSizeThreshold(user?.large_page_size_threshold);
					setEndpoint(UserApiEndpoint);
			  })();

		return { user, siteId, largePageSizeThreshold, endpoint };
	}, [user, siteId]);

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
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{GlobalSettingsLabels[2].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">
						{GlobalSettingsLabels[2].description}
					</p>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-3xl p-4 pt-0 pb-2">
				<LargePageSizeSettingsForm
					componentReady={componentReady}
					endpoint={endpoint}
					largePageSizeThreshold={largePageSizeThreshold}
					mutateSite={mutateSite}
					mutateSiteId={mutateSiteId}
					setErrorMsg={setErrorMsg}
					siteIdApiEndpoint={siteIdApiEndpoint}
					setLargePageSizeThreshold={setLargePageSizeThreshold}
					setSuccessMsg={setSuccessMsg}
					siteId={siteId}
					user={user}
				/>
			</div>
		</div>
	);
};

LargePageSizeSettings.propTypes = {
	site: PropTypes.object,
	id: PropTypes.number,
	large_page_size_threshold: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

LargePageSizeSettings.defaultProps = {
	site: null,
	id: null,
	large_page_size_threshold: null
};

export default LargePageSizeSettings;

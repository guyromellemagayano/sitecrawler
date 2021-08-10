// React
import * as React from "react";

// External
import "twin.macro";
import PropTypes from "prop-types";

// Enums
import { InformationLabels } from "@enums/InformationLabels";

// Components
import ErrorNotification from "@components/notifications/ErrorNotification";
import UrlInformationStepForm from "@components/forms/UrlInformationStepForm";

const UrlInformationStep = ({
	currentStep,
	editMode,
	setCurrentStep,
	setEditMode,
	setSiteData,
	siteData
}) => {
	const [errorMsg, setErrorMsg] = React.useState("");
	const [errorMsgLoaded, setErrorMsgLoaded] = React.useState(false);

	return currentStep == 1 ? (
		<>
			<ErrorNotification
				errorMsg={errorMsg}
				errorMsgLoaded={errorMsgLoaded}
				setErrorMsgLoaded={setErrorMsgLoaded}
				errorMsgTitle={InformationLabels[16].label}
			/>

			<div tw="block pt-8 pb-12 px-4">
				<div tw="py-4 m-auto">
					<div tw="block mb-12">
						<span tw="inline-flex flex-col">
							<h4 tw="text-lg self-start leading-7 font-medium text-gray-900">
								{InformationLabels[3].label}
							</h4>
							<p tw="text-sm self-start mt-1 leading-5 text-gray-500">
								{InformationLabels[3].description}
							</p>
						</span>
					</div>

					<UrlInformationStepForm
						currentStep={currentStep}
						editMode={editMode}
						setCurrentStep={setCurrentStep}
						setEditMode={setEditMode}
						errorMsg={errorMsg}
						errorMsgLoaded={errorMsgLoaded}
						setErrorMsg={setErrorMsg}
						setErrorMsgLoaded={setErrorMsgLoaded}
						setSiteData={setSiteData}
						siteData={siteData}
					/>
				</div>
			</div>
		</>
	) : null;
};

UrlInformationStep.propTypes = {
	currentStep: PropTypes.number,
	editMode: PropTypes.bool,
	setCurrentStep: PropTypes.func,
	setEditMode: PropTypes.func,
	setSiteData: PropTypes.func,
	siteData: PropTypes.shape({
		id: PropTypes.number,
		name: PropTypes.string,
		url: PropTypes.string
	})
};

UrlInformationStep.defaultProps = {
	currentStep: null,
	editMode: false,
	setCurrentStep: null,
	setEditMode: null,
	setSiteData: null,
	siteData: {
		id: null,
		name: null,
		url: null
	}
};

export default UrlInformationStep;

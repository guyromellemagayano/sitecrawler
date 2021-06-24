// React
import * as React from "react";

// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import InformationLabel from "public/labels/pages/add-new-site/information.json";

// Loadable
const UrlInformationStep = loadable(() => import("src/components/steps/UrlInformationStep"));
const VerifyUrlStep = loadable(() => import("src/components/steps/VerifyUrlStep"));

const AddSiteSteps = () => {
	const [currentStep, setCurrentStep] = React.useState(1);
	const [editMode, setEditMode] = React.useState(false);
	const [siteData, setSiteData] = React.useState({});
	const [siteId, setSiteId] = React.useState(null);

	const stepsData = [
		{
			title: InformationLabel[13].label,
			subtitle: InformationLabel[1].label
		},
		{
			title: InformationLabel[14].label,
			subtitle: InformationLabel[2].label
		}
	];

	return (
		<>
			<nav aria-label={InformationLabel[18].label} tw="max-w-full p-4">
				<ol tw="space-y-4 md:flex md:space-y-0 md:space-x-8">
					{stepsData.map((value, key) => {
						return (
							<li key={key} tw="md:flex-1">
								<span
									css={[
										key == currentStep - 1 ? tw`border-indigo-600` : tw`border-gray-200`,
										tw`pl-4 py-2 flex flex-col border-l-4 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4`
									]}
									aria-current="step"
								>
									<span tw="text-xs text-indigo-600 font-semibold tracking-wide uppercase">{value.title}</span>
									<span tw="text-sm font-medium">{value.subtitle}</span>
								</span>
							</li>
						);
					})}
				</ol>
			</nav>

			<UrlInformationStep
				currentStep={currentStep}
				setCurrentStep={setCurrentStep}
				siteData={siteData}
				setSiteData={setSiteData}
				editMode={editMode}
				setEditMode={setEditMode}
				siteId={siteId}
			/>
			<VerifyUrlStep
				currentStep={currentStep}
				setCurrentStep={setCurrentStep}
				siteData={siteData}
				setEditMode={setEditMode}
				setSiteId={setSiteId}
			/>
		</>
	);
};

AddSiteSteps.propTypes = {};

export default AddSiteSteps;

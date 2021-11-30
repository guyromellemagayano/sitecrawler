// React
import { useState } from "react";

// External
import tw from "twin.macro";

// Enums
import { InformationLabels } from "@enums/InformationLabels";

// Components
import UrlInformationStep from "./UrlInformationStep";
import VerifyUrlStep from "./VerifyUrlStep";

const AddSiteSteps = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const [editMode, setEditMode] = useState(false);
	const [siteData, setSiteData] = useState({});
	const [siteId, setSiteId] = useState(null);

	const stepsData = [
		{
			title: InformationLabels[13].label,
			subtitle: InformationLabels[1].label
		},
		{
			title: InformationLabels[14].label,
			subtitle: InformationLabels[2].label
		}
	];

	return (
		<>
			<nav aria-label={InformationLabels[18].label} tw="max-w-full p-4">
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
									<span tw="text-xs text-indigo-600 font-semibold tracking-wide uppercase">
										{value.title}
									</span>
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

export default AddSiteSteps;

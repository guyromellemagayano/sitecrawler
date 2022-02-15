import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";
import { MemoizedUrlInformationStep } from "./UrlInformationStep";
import { MemoizedVerifyUrlStep } from "./VerifyUrlStep";

/**
 * Custom function to render the `AddSiteSteps` component
 */
const AddSiteSteps = (props) => {
	// Props
	const { step } = props;

	// Translations
	const { t } = useTranslation();
	const dismiss = t("common:dismiss");
	const step1 = t("sites:step1");
	const step2 = t("sites:step2");
	const step3 = t("sites:step3");
	const verifySiteTitle = t("sites:verifySiteTitle");
	const verifiedSite = t("sites:verifiedSite");
	const formDetailLabel = t("sites:form.detail.label");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser();

	const stepsData = [
		{
			title: step1,
			subtitle: formDetailLabel
		},
		{
			title: step2,
			subtitle: verifySiteTitle
		},
		{
			title: step3,
			subtitle: verifiedSite
		}
	];

	return (
		<div tw="w-full h-full flex items-start flex-col justify-center flex-auto xl:max-w-4xl">
			<div tw="w-full xl:flex-grow xl:pr-8 xl:border-r xl:border-gray-200">
				<nav aria-label={dismiss} tw="w-full pt-8 pb-4">
					<ol tw="md:flex md:space-y-0 md:space-x-8 space-y-4">
						{stepsData.map((value, key) => {
							return isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
								<li key={key} tw="md:flex-1">
									<span
										css={[
											key === parseInt(step) - 1 ? tw`border-indigo-600` : tw`border-gray-200`,
											tw`pl-4 py-2 flex flex-col border-l-4 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4`
										]}
										aria-current="step"
									>
										<span tw="text-xs text-indigo-600 font-semibold tracking-wide uppercase">{value.title}</span>
										<span tw="text-sm font-medium">{value.subtitle}</span>
									</span>
								</li>
							) : (
								<div key={key} tw="w-full md:flex-1">
									<Skeleton duration={2} height={4} />
									<span tw="flex flex-col md:pl-0 pl-4">
										<Skeleton duration={2} width={75} height={16} />
										<Skeleton duration={2} width={150} height={20} />
									</span>
								</div>
							);
						})}
					</ol>
				</nav>

				{step === 1 ? <MemoizedUrlInformationStep {...props} /> : <MemoizedVerifyUrlStep {...props} />}
			</div>
		</div>
	);
};

AddSiteSteps.propTypes = {
	step: PropTypes.number
};

/**
 * Memoized custom `AddSiteSteps` component
 */
export const MemoizedAddSiteSteps = memo(AddSiteSteps);

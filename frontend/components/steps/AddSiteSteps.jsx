import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classNames } from "@utils/classNames";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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
		<div className="flex h-full w-full flex-auto flex-col items-start justify-center xl:max-w-4xl">
			<div className="w-full xl:flex-grow xl:border-r xl:border-gray-200 xl:pr-8">
				<nav aria-label={dismiss} className="w-full pt-8 pb-4">
					<ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
						{stepsData.map((value, key) => {
							return isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
								<li key={key} className="md:flex-1">
									<span
										className={classNames(
											key === parseInt(step) - 1 ? "border-indigo-600" : "border-gray-200",
											"flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
										)}
										aria-current="step"
									>
										<span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{value.title}</span>
										<span className="text-sm font-medium">{value.subtitle}</span>
									</span>
								</li>
							) : (
								<div key={key} className="w-full md:flex-1">
									<Skeleton duration={2} height={4} />
									<span className="flex flex-col pl-4 md:pl-0">
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

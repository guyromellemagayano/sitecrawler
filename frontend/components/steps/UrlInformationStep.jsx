import { MemoizedUrlInformationStepForm } from "@components/forms/UrlInformationStepForm";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `UrlInformationStep` component
 */
const UrlInformationStep = (props) => {
	// Props
	const { step } = props;

	// Translations
	const { t } = useTranslation();
	const formDetailLabel = t("sites:form.detail.label");
	const formDetailDescription = t("sites:form.detail.description");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	return (
		<div className="block pt-8 pb-12">
			<div className="m-auto py-4">
				<div className="mb-12 block">
					<span className="inline-flex flex-col">
						<h4 className="self-start text-lg font-medium leading-7 text-gray-900">
							{isComponentReady ? formDetailLabel : <Skeleton duration={2} width={100} height={24} />}
						</h4>
						<p className="mt-1 self-start text-sm leading-5 text-gray-500">
							{isComponentReady ? formDetailDescription : <Skeleton duration={2} width={200} height={24} />}
						</p>
					</span>
				</div>

				<MemoizedUrlInformationStepForm {...props} />
			</div>
		</div>
	);
};

UrlInformationStep.propTypes = {
	step: PropTypes.number
};

/**
 * Memoized custom `UrlInformationStep` component
 */
export const MemoizedUrlInformationStep = memo(UrlInformationStep);

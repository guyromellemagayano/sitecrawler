import { MemoizedUrlInformationStepForm } from "@components/forms/UrlInformationStepForm";
import { useLoading } from "@hooks/useLoading";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

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
	const { user } = useContext(SiteCrawlerAppContext);

	// Custom hooks
	const { isComponentReady } = useLoading();

	return step === 1 ? (
		<div tw="block pt-8 pb-12">
			<div tw="py-4 m-auto">
				<div tw="block mb-12">
					<span tw="inline-flex flex-col">
						<h4 tw="text-lg self-start leading-7 font-medium text-gray-900">
							{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
								formDetailLabel
							) : (
								<Skeleton duration={2} width={175} height={24} />
							)}
						</h4>
						<p tw="text-sm self-start mt-1 leading-5 text-gray-500">
							{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
								formDetailDescription
							) : (
								<Skeleton duration={2} width={175} height={24} />
							)}
						</p>
					</span>
				</div>

				<MemoizedUrlInformationStepForm {...props} />
			</div>
		</div>
	) : null;
};

UrlInformationStep.propTypes = {
	step: PropTypes.number
};

/**
 * Memoized custom `UrlInformationStep` component
 */
export const MemoizedUrlInformationStep = memo(UrlInformationStep);

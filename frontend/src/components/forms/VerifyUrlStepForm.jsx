// React
import PropTypes from "prop-types";
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import axios from "axios";
import Cookies from "js-cookie";
import tw from "twin.macro";

// JSON
import { VerifyUrlLabels } from "@enums/VerifyUrlLabels";

const VerifyUrlStepForm = ({
	currentStep,
	disableSiteVerify,
	enableNextStep,
	errorMsgLoaded,
	setCurrentStep,
	setDisableSiteVerify,
	setEditMode,
	setEnableNextStep,
	setErrorMsg,
	setErrorMsgLoaded,
	setSiteId,
	setSiteVerifyId,
	setSuccessMsg,
	setSuccessMsgLoaded,
	siteData,
	siteVerifyId,
	successMsgLoaded
}) => {
	const handleSubmit = async (e) => {
		e?.preventDefault();

		setDisableSiteVerify(!disableSiteVerify);

		const body = {
			sid: e?.currentTarget?.site_verify_id?.value
		};

		const response = await axios
			.post("/api/site/" + body?.sid + "/verify/", body, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"X-CSRFToken": Cookies.get("csrftoken")
				}
			})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				return error.response;
			});

		const data = await response?.data;

		if (Math.floor(response?.status / 200) === 1) {
			if (data?.verified === true) {
				setSuccessMsg(VerifyUrlLabels[20].label);
				setSuccessMsgLoaded(!successMsgLoaded);
				setTimeout(() => {
					setEnableNextStep(!enableNextStep);
					setDisableSiteVerify(false);
				}, 1000);
			} else {
				setErrorMsg(VerifyUrlLabels[21].label);
				setErrorMsgLoaded(!errorMsgLoaded);
				setTimeout(() => {
					setDisableSiteVerify(false);
				}, 1000);
			}
		} else {
			setErrorMsg(VerifyUrlLabels[21].label);
			setErrorMsgLoaded(!errorMsgLoaded);

			return null;
		}
	};

	const handleEditMode = (e) => {
		e.preventDefault();

		setSiteId(siteData?.id);
		setEditMode(true);
		setCurrentStep(currentStep - 1);
	};

	const handleHiddenInputChange = (e) => {
		setSiteVerifyId({ value: e?.currentTarget.site_verify_id.value });
	};

	return (
		<form onSubmit={handleSubmit} tw="sm:flex sm:items-center w-full">
			<input
				type="hidden"
				value={siteVerifyId}
				name="site_verify_id"
				onChange={handleHiddenInputChange}
			/>
			<div tw="flex lg:justify-between w-full">
				{enableNextStep ? (
					<span tw="inline-flex">
						<Link href="/site/[id]/overview" as={`/site/${siteData?.id}/overview`} passHref>
							<a
								css={[
									tw`cursor-pointer inline-flex sm:mt-0 relative items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
									disableSiteVerify
										? tw`opacity-50 bg-green-400 cursor-not-allowed`
										: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
								]}
							>
								{VerifyUrlLabels[13].label}
							</a>
						</Link>
					</span>
				) : (
					<>
						<div>
							<span tw="inline-flex">
								<button
									type="submit"
									disabled={disableSiteVerify}
									css={[
										tw`w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
										disableSiteVerify
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
									]}
								>
									{disableSiteVerify ? VerifyUrlLabels[18].label : VerifyUrlLabels[10].label}
								</button>
							</span>

							<span tw="inline-flex">
								<Link href="/sites" passHref>
									<a
										disabled={disableSiteVerify}
										css={[
											tw`cursor-pointer w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-600`,
											disableSiteVerify
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`
										]}
									>
										{VerifyUrlLabels[11].label}
									</a>
								</Link>
							</span>
						</div>

						<div>
							<span tw="inline-flex">
								<button
									disabled={disableSiteVerify}
									css={[
										tw`cursor-pointer w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-sm leading-5 font-medium text-gray-700 bg-white`,
										disableSiteVerify
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
									]}
									onClick={handleEditMode}
								>
									{VerifyUrlLabels[12].label}
								</button>
							</span>
						</div>
					</>
				)}
			</div>
		</form>
	);
};

VerifyUrlStepForm.propTypes = {
	currentStep: PropTypes.number,
	disableSiteVerify: PropTypes.bool,
	enableNextStep: PropTypes.bool,
	errorMsgLoaded: PropTypes.bool,
	setCurrentStep: PropTypes.number,
	setDisableSiteVerify: PropTypes.bool,
	setEditMode: PropTypes.bool,
	setEnableNextStep: PropTypes.bool,
	setErrorMsg: PropTypes.string,
	setErrorMsgLoaded: PropTypes.bool,
	setSiteId: PropTypes.number,
	setSiteVerifyId: PropTypes.number,
	setSuccessMsg: PropTypes.string,
	setSuccessMsgLoaded: PropTypes.bool,
	siteData: PropTypes.shape({
		id: PropTypes.number
	}),
	siteVerifyId: PropTypes.number,
	successMsgLoaded: PropTypes.bool
};

VerifyUrlStepForm.defaultProps = {
	currentStep: null,
	disableSiteVerify: false,
	enableNextStep: false,
	errorMsgLoaded: false,
	setCurrentStep: null,
	setDisableSiteVerify: false,
	setEditMode: false,
	setEnableNextStep: false,
	setErrorMsg: null,
	setErrorMsgLoaded: false,
	setSiteId: null,
	setSiteVerifyId: null,
	setSuccessMsg: null,
	setSuccessMsgLoaded: false,
	siteData: {
		id: null
	},
	siteVerifyId: null,
	successMsgLoaded: false
};

export default VerifyUrlStepForm;

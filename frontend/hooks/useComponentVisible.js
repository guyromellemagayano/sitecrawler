import { useState, useRef, useEffect } from "react";

/**
 * Custom React hook that handles showing/hiding <Transition> components.
 * It can hide those components either by pressing the `ESC` buttom or by clicking
 * outside the component DOM
 *
 * @param {boolean} initialIsVisible
 * @returns {object} ref, isComponentVisible, setIsComponentVisible
 */
export const useComponentVisible = (initialIsVisible) => {
	const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);

	const ref = useRef(null);

	const handleHideComponent = (event) => {
		if (event?.key === "Escape" && ref?.current) {
			setIsComponentVisible(false);
		}
	};

	const handleClickOutsideComponent = (event) => {
		if (ref?.current && !Object.values(ref?.current).includes(event?.target)) {
			setIsComponentVisible(false);
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", handleHideComponent, true);
		document.addEventListener("click", handleClickOutsideComponent, true);

		return () => {
			document.removeEventListener("keydown", handleHideComponent, true);
			document.removeEventListener("click", handleClickOutsideComponent, true);
		};
	});

	return { ref, isComponentVisible, setIsComponentVisible };
};

/**
 * Custom React hook that handles showing/hiding site verification modal components.
 * It can hide those components either by pressing the `ESC` buttom or by clicking
 * outside the component DOM
 *
 * @param {boolean} initialIsVisible
 * @returns {object} siteVerifyModalRef, isSiteVerifyModalVisible, setIsSiteVerifyModalVisible
 */
export const useSiteVerifyModalVisible = (initialIsVisible) => {
	const [isSiteVerifyModalVisible, setIsSiteVerifyModalVisible] = useState(initialIsVisible);

	const siteVerifyModalRef = useRef(null);

	const handleHideSiteVerifyModal = (event) => {
		if (event?.key === "Escape" && siteVerifyModalRef?.current) {
			setIsSiteVerifyModalVisible(!isSiteVerifyModalVisible);
		}
	};

	const handleClickOutsideSiteVerifyModal = (event) => {
		if (siteVerifyModalRef?.current && !Object.values(siteVerifyModalRef?.current).includes(event?.target)) {
			setIsSiteVerifyModalVisible(!isSiteVerifyModalVisible);
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", handleHideSiteVerifyModal, true);
		document.addEventListener("click", handleClickOutsideSiteVerifyModal, true);

		return () => {
			document.removeEventListener("keydown", handleHideSiteVerifyModal, true);
			document.removeEventListener("click", handleClickOutsideSiteVerifyModal, true);
		};
	});

	return { siteVerifyModalRef, isSiteVerifyModalVisible, setIsSiteVerifyModalVisible };
};

/**
 * Custom React hook that handles showing/hiding site delete modal components.
 * It can hide those components either by pressing the `ESC` buttom or by clicking
 * outside the component DOM
 *
 * @param {boolean} initialIsVisible
 * @returns {object} siteDeleteModalRef, isSiteDeleteModalVisible, setIsSiteDeleteModalVisible
 */
export const useSiteDeleteModalVisible = (initialIsVisible) => {
	const [isSiteDeleteModalVisible, setIsSiteDeleteModalVisible] = useState(initialIsVisible);

	const siteDeleteModalRef = useRef(null);

	const handleHideSiteDeleteModal = (event) => {
		if (event?.key === "Escape" && siteDeleteModalRef?.current) {
			setIsSiteDeleteModalVisible(!isSiteDeleteModalVisible);
		}
	};

	const handleClickOutsideSiteDeleteModal = (event) => {
		if (siteDeleteModalRef?.current && !Object.values(siteDeleteModalRef?.current).includes(event?.target)) {
			setIsSiteDeleteModalVisible(!isSiteDeleteModalVisible);
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", handleHideSiteDeleteModal, true);
		document.addEventListener("click", handleClickOutsideSiteDeleteModal, true);

		return () => {
			document.removeEventListener("keydown", handleHideSiteDeleteModal, true);
			document.removeEventListener("click", handleClickOutsideSiteDeleteModal, true);
		};
	});

	return { siteDeleteModalRef, isSiteDeleteModalVisible, setIsSiteDeleteModalVisible };
};

/**
 * Custom React hook that handles showing/hiding new active plan modal components.
 * It can hide those components either by pressing the `ESC` buttom or by clicking
 * outside the component DOM
 *
 * @param {boolean} initialIsVisible
 * @returns {object} newActivePlanModalRef, isNewActivePlanModalVisible, setIsNewActivePlanModalVisible
 */
export const useNewActivePlanModalVisible = (initialIsVisible) => {
	const [isNewActivePlanModalVisible, setIsNewActivePlanModalVisible] = useState(initialIsVisible);

	const newActivePlanModalRef = useRef(null);

	const handleHideNewActivePlanModal = (event) => {
		if (event?.key === "Escape" && newActivePlanModalRef?.current) {
			setIsNewActivePlanModalVisible(!isNewActivePlanModalVisible);
		}
	};

	const handleClickOutsideNewActivePlanModal = (event) => {
		if (newActivePlanModalRef?.current && !Object.values(newActivePlanModalRef?.current).includes(event?.target)) {
			setIsNewActivePlanModalVisible(!isNewActivePlanModalVisible);
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", handleHideNewActivePlanModal, true);
		document.addEventListener("click", handleClickOutsideNewActivePlanModal, true);

		return () => {
			document.removeEventListener("keydown", handleHideNewActivePlanModal, true);
			document.removeEventListener("click", handleClickOutsideNewActivePlanModal, true);
		};
	});

	return { newActivePlanModalRef, isNewActivePlanModalVisible, setIsNewActivePlanModalVisible };
};

/**
 * Custom React hook that handles showing/hiding change to Basic Plan modal components.
 * It can hide those components either by pressing the `ESC` buttom or by clicking
 * outside the component DOM
 *
 * @param {boolean} initialIsVisible
 * @returns {object} changeToBasicPlanModalRef, isChangeToBasicPlanModalVisible, setIsChangeToBasicPlanModalVisible
 */
export const useChangeToBasicPlanModalVisible = (initialIsVisible) => {
	const [isChangeToBasicPlanModalVisible, setIsChangeToBasicPlanModalVisible] = useState(initialIsVisible);

	const changeToBasicPlanModalRef = useRef(null);

	const handleHideChangeToBasicPlanModal = (event) => {
		if (event?.key === "Escape" && changeToBasicPlanModalRef?.current) {
			setIsChangeToBasicPlanModalVisible(!isChangeToBasicPlanModalVisible);
		}
	};

	const handleClickOutsideNewActivePlanModal = (event) => {
		if (
			changeToBasicPlanModalRef?.current &&
			!Object.values(changeToBasicPlanModalRef?.current).includes(event?.target)
		) {
			setIsChangeToBasicPlanModalVisible(!isChangeToBasicPlanModalVisible);
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", handleHideChangeToBasicPlanModal, true);
		document.addEventListener("click", handleClickOutsideNewActivePlanModal, true);

		return () => {
			document.removeEventListener("keydown", handleHideChangeToBasicPlanModal, true);
			document.removeEventListener("click", handleClickOutsideNewActivePlanModal, true);
		};
	});

	return {
		changeToBasicPlanModalRef,
		isChangeToBasicPlanModalVisible,
		setIsChangeToBasicPlanModalVisible
	};
};

/**
 * Custom React hook that handles showing/hiding payment method modal components.
 * It can hide those components either by pressing the `ESC` buttom or by clicking
 * outside the component DOM
 *
 * @param {boolean} initialIsVisible
 * @returns {object} paymentMethodModalRef, isPaymentMethodModalVisible, setIsPaymentMethodModalVisible
 */
export const usePaymentMethodModalVisible = (initialIsVisible) => {
	const [isPaymentMethodModalVisible, setIsPaymentMethodModalVisible] = useState(initialIsVisible);

	const paymentMethodModalRef = useRef(null);

	const handleHidePaymentMethodModal = (event) => {
		if (event?.key === "Escape" && paymentMethodModalRef?.current) {
			setIsPaymentMethodModalVisible(!isPaymentMethodModalVisible);
		}
	};

	const handleClickOutsidePaymentMethodModal = (event) => {
		if (paymentMethodModalRef?.current && !Object.values(paymentMethodModalRef?.current).includes(event?.target)) {
			setIsPaymentMethodModalVisible(!isPaymentMethodModalVisible);
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", handleHidePaymentMethodModal, true);
		document.addEventListener("click", handleClickOutsidePaymentMethodModal, true);

		return () => {
			document.removeEventListener("keydown", handleHidePaymentMethodModal, true);
			document.removeEventListener("click", handleClickOutsidePaymentMethodModal, true);
		};
	});

	return {
		paymentMethodModalRef,
		isPaymentMethodModalVisible,
		setIsPaymentMethodModalVisible
	};
};

/**
 * Custom React hook that handles showing/hiding upgrade error modal components.
 * It can hide those components either by pressing the `ESC` buttom or by clicking
 * outside the component DOM
 *
 * @param {boolean} initialIsVisible
 * @returns {object} upgradeErrorModalRef, isUpgradeErrorModalVisible, setIsUpgradeErrorModalVisible
 */
export const useUpgradeErrorModalVisible = (initialIsVisible) => {
	const [isUpgradeErrorModalVisible, setIsUpgradeErrorModalVisible] = useState(initialIsVisible);

	const upgradeErrorModalRef = useRef(null);

	const handleHideUpgradeErrorModal = (event) => {
		if (event?.key === "Escape" && upgradeErrorModalRef?.current) {
			setIsUpgradeErrorModalVisible(!isUpgradeErrorModalVisible);
		}
	};

	const handleClickOutsideUpgradeErrorModal = (event) => {
		if (upgradeErrorModalRef?.current && !Object.values(upgradeErrorModalRef?.current).includes(event?.target)) {
			setIsUpgradeErrorModalVisible(!isUpgradeErrorModalVisible);
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", handleHideUpgradeErrorModal, true);
		document.addEventListener("click", handleClickOutsideUpgradeErrorModal, true);

		return () => {
			document.removeEventListener("keydown", handleHideUpgradeErrorModal, true);
			document.removeEventListener("click", handleClickOutsideUpgradeErrorModal, true);
		};
	});

	return {
		upgradeErrorModalRef,
		isUpgradeErrorModalVisible,
		setIsUpgradeErrorModalVisible
	};
};

/**
 * Custom React hook that handles showing/hiding site verify error modal components.
 * It can hide those components either by pressing the `ESC` buttom or by clicking
 * outside the component DOM
 *
 * @param {boolean} initialIsVisible
 * @returns {object} siteVerifyErrorModalRef, isSiteVerifyErrorModalVisible, setIsSiteVerifyErrorModalVisible
 */
export const useSiteVerifyErrorModalVisible = (initialIsVisible) => {
	const [isSiteVerifyErrorModalVisible, setIsSiteVerifyErrorModalVisible] = useState(initialIsVisible);

	const siteVerifyErrorModalRef = useRef(null);

	const handleHideSiteVerifyErrorModal = (event) => {
		if (event?.key === "Escape" && siteVerifyErrorModalRef?.current) {
			setIsSiteVerifyErrorModalVisible(!isSiteVerifyErrorModalVisible);
		}
	};

	const handleClickOutsideUpgradeErrorModal = (event) => {
		if (siteVerifyErrorModalRef?.current && !Object.values(siteVerifyErrorModalRef?.current).includes(event?.target)) {
			setIsSiteVerifyErrorModalVisible(!isSiteVerifyErrorModalVisible);
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", handleHideSiteVerifyErrorModal, true);
		document.addEventListener("click", handleClickOutsideUpgradeErrorModal, true);

		return () => {
			document.removeEventListener("keydown", handleHideSiteVerifyErrorModal, true);
			document.removeEventListener("click", handleClickOutsideUpgradeErrorModal, true);
		};
	});

	return {
		siteVerifyErrorModalRef,
		isSiteVerifyErrorModalVisible,
		setIsSiteVerifyErrorModalVisible
	};
};

// React
import { useState, useEffect } from "react";

// External
import { Formik } from "formik";
import * as Yup from "yup";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import CardLabel from "public/labels/components/billing/Card.json";

// Hooks
import usePatchMethod from "src/hooks/usePatchMethod";

// Components
const ErrorNotification = loadable(() => import("src/components/notifications/ErrorNotification"));
const SuccessNotification = loadable(() => import("src/components/notifications/SuccessNotification"));

const SettingsCard = ({ user, card }) => {
	const [cardCvc, setCardCvc] = useState("")
	const [cardExpirationDate, setCardExpirationDate] = useState("")
	const [cardNumber, setCardNumber] = useState("")
	const [componentReady, setComponentReady] = useState(false);
	const [disableForm, setDisableForm] = useState(true);
	const [errorMsg, setErrorMsg] = useState("");
	const [errorMsgLoaded, setErrorMsgLoaded] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");
	const [successMsgLoaded, setSuccessMsgLoaded] = useState(false);

	const userApiEndpoint = "/api/auth/user/";

	const handleCardNumberInputChange = (e) => {
		setCardNumber(e.target.value);
	}

	const handleCardExpirationDateInputChange = (e) => {
		setCardExpirationDate(e.target.value);
	}

	useEffect(() => {
		if (user && user !== undefined && Object.keys(user).length > 0 && card && card !== undefined) {
			console.log(card)
			setCardNumber()
			setCardExpirationDate()

			setTimeout(() => {
				setComponentReady(true)
			}, 500);
		}
	}, [user, card])

	return (
		<div>

		</div>
	)
}

SettingsCard.propTypes = {}

export default SettingsCard;

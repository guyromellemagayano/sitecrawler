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
// TODO: Add SettingsCardSkeleton component here

const SettingsCard = ({ user }) => {
	return (

	)
}

SettingsCard.propTypes = {}

export default SettingsCard;

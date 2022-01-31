import { GoogleLoginApiEndpoint } from "@constants/ApiEndpoints";
import useTranslation from "next-translate/useTranslation";

export const SocialLoginLinks = () => {
	const { t } = useTranslation("login");
	const googleSignIn = t("googleSignIn");

	const linksArray = [];

	const googleLink = {
		href: GoogleLoginApiEndpoint,
		label: googleSignIn,
		icon: ["fab", "google"],
		disabled: false
	};

	linksArray.push(googleLink);

	return linksArray;
};

import { GoogleLoginApiEndpoint } from "@configs/ApiEndpoints";
import useTranslation from "next-translate/useTranslation";

export const SocialLoginLinks = () => {
	const { t } = useTranslation("login");
	const googleSignIn = t("googleSignIn");

	const linksArray = new Array();

	const googleLink = {
		href: GoogleLoginApiEndpoint,
		label: googleSignIn,
		icon: ["fab", "google"],
		disabled: false
	};

	linksArray.push(googleLink);

	return linksArray;
};

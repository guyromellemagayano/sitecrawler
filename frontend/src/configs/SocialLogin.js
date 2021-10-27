import { GoogleLoginApiEndpoint } from "@enums/ApiEndpoints";
import useTranslation from "next-translate/useTranslation";

export const SocialLoginLinks = () => {
	const { t } = useTranslation("login");
	const googleSignIn = t("googleSignIn");
	const facebookSignIn = t("facebookSignIn");
	const linkedinSignIn = t("linkedinSignIn");

	const linksArray = new Array();

	const googleLink = {
		href: GoogleLoginApiEndpoint,
		label: googleSignIn,
		icon: ["fab", "google"],
		disabled: false
	};
	const facebookLink = {
		href: "#",
		label: facebookSignIn,
		icon: ["fab", "facebook-f"],
		disabled: true
	};
	const linkedinLink = {
		href: "#",
		label: linkedinSignIn,
		icon: ["fab", "linkedin-in"],
		disabled: true
	};

	linksArray.push(googleLink);
	linksArray.push(facebookLink);
	linksArray.push(linkedinLink);

	return linksArray;
};

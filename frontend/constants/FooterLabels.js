import useTranslation from "next-translate/useTranslation";

export const FooterLabels = () => {
	const { t } = useTranslation("common");
	const about = t("about");
	const privacyPolicy = t("privacyPolicy");
	const terms = t("terms");
	const support = t("support");

	const labelsArray = new Array();

	const aboutLink = { label: about, link: "/about/" };
	const privacyPolicyLink = { label: privacyPolicy, link: "/privacy-policy/" };
	const termsLink = { label: terms, link: "/terms/" };
	const supportLink = { label: support, link: "/support/" };

	labelsArray.push(aboutLink);
	labelsArray.push(privacyPolicyLink);
	labelsArray.push(termsLink);
	labelsArray.push(supportLink);

	return labelsArray;
};

import useTranslation from "next-translate/useTranslation";

export const LinksTableLabels = () => {
	const { t } = useTranslation("sites");
	const linkUrl = t("linkUrl");
	const urlType = t("urlType");
	const status = t("status");
	const httpCode = t("httpCode");
	const linkLocation = t("linkLocation");
	const occurrences = t("occurrences");

	const labelsArray = [];

	const linkUrlTableLabel = { label: linkUrl, slug: "link-url", key: "url" };
	const urlTypeTableLabel = { label: urlType, slug: "url-type", key: "type" };
	const statusTableLabel = { label: status, slug: "status", key: "status" };
	const httpCodeTableLabel = { label: httpCode, slug: "http-code", key: "http_status" };
	const linkLocationTableLabel = { label: linkLocation };
	const occurrencesTableLabel = { label: occurrences, slug: "occurrences", key: "occurrences" };

	labelsArray.push(linkUrlTableLabel);
	labelsArray.push(urlTypeTableLabel);
	labelsArray.push(statusTableLabel);
	labelsArray.push(httpCodeTableLabel);
	labelsArray.push(linkLocationTableLabel);
	labelsArray.push(occurrencesTableLabel);

	return labelsArray;
};

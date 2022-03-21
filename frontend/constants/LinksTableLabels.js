import useTranslation from "next-translate/useTranslation";

export const LinksTableLabels = () => {
	const { t } = useTranslation("sites");
	const linkUrl = t("url");
	const urlType = t("type");
	const status = t("status");
	const httpStatus = t("httpStatus");
	// const linkLocation = t("location");
	const occurrences = t("occurrences");
	const errorMessage = t("errorMessage");
	const statusResolved = t("statusResolved");
	const tlsResolved = t("tlsResolved");

	const labelsArray = [];

	const linkUrlTableLabel = { label: linkUrl, slug: "link-url", key: "url" };
	const urlTypeTableLabel = { label: urlType, slug: "url-type", key: "type" };
	const statusTableLabel = { label: status, slug: "status", key: "status" };
	const httpStatusTableLabel = { label: httpStatus, slug: "http-status", key: "http_status" };
	// const linkLocationTableLabel = { label: linkLocation };
	const occurrencesTableLabel = { label: occurrences, slug: "occurrences", key: "occurences" };
	const statusResolvedTableLabel = { label: statusResolved };
	const tlsResolvedTableLabel = { label: tlsResolved };

	labelsArray.push(linkUrlTableLabel);
	labelsArray.push(urlTypeTableLabel);
	labelsArray.push(statusTableLabel);
	labelsArray.push(httpStatusTableLabel);
	// labelsArray.push(linkLocationTableLabel);
	labelsArray.push(occurrencesTableLabel);
	labelsArray.push(statusResolvedTableLabel);
	labelsArray.push(tlsResolvedTableLabel);

	return labelsArray;
};

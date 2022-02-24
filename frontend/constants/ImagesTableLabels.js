import useTranslation from "next-translate/useTranslation";

export const ImagesTableLabels = () => {
	const { t } = useTranslation("sites");
	const status = t("status");
	const type = t("type");
	const url = t("url");
	const httpStatus = t("httpStatus");
	const size = t("size");
	const occurences = t("occurrences");
	const tlsStatus = t("tlsStatus");
	const missingAlts = t("missingAlts");
	const resolvedStatus = t("statusResolved");
	const resolvedMissingAlts = t("resolvedMissingAlts");
	const tlsResolved = t("tlsResolved");

	const labelsArray = [];

	const statusTableLabel = { label: status, slug: "status", key: "status" };
	const typeTableLabel = { label: type, slug: "type", key: "type" };
	const urlTableLabel = { label: url, slug: "url", key: "url" };
	const httpStatusTableLabel = { label: httpStatus, slug: "http-status", key: "http_status" };
	const sizeTableLabel = { label: size, slug: "size", key: "size" };
	const occurencesTableLabel = { label: occurences, slug: "occurrences", key: "occurences" };
	const tlsStatusTableLabel = { label: tlsStatus, slug: "tls-status", key: "tls_status" };
	const missingAltsTableLabel = { label: missingAlts, slug: "missing-alts", key: "missing_alts" };
	const resolvedStatusTableLabel = { label: resolvedStatus };
	const resolvedMissingAltsTableLabel = { label: resolvedMissingAlts };
	const tlsResolvedTableLabel = { label: tlsResolved };

	labelsArray.push(urlTableLabel);
	labelsArray.push(typeTableLabel);
	labelsArray.push(statusTableLabel);
	labelsArray.push(tlsStatusTableLabel);
	labelsArray.push(httpStatusTableLabel);
	labelsArray.push(sizeTableLabel);
	labelsArray.push(occurencesTableLabel);
	labelsArray.push(missingAltsTableLabel);
	labelsArray.push(resolvedStatusTableLabel);
	labelsArray.push(resolvedMissingAltsTableLabel);
	labelsArray.push(tlsResolvedTableLabel);

	return labelsArray;
};

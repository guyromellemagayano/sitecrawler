import useTranslation from "next-translate/useTranslation";

export const PagesTableLabels = () => {
	const { t } = useTranslation("sites");
	const pageUrl = t("pageUrl");
	const pageSize = t("pageSize");
	const ssl = t("ssl");

	const labelsArray = [];

	const pageUrlTableLabel = { label: pageUrl, slug: "page-url", key: "url" };
	const pageSizeTableLabel = { label: pageSize, slug: "page-size", key: "size_total" };
	const sslTableLabel = { label: ssl, slug: "page-ssl", key: "tls_total" };

	labelsArray.push(pageUrlTableLabel);
	labelsArray.push(pageSizeTableLabel);
	labelsArray.push(sslTableLabel);

	return labelsArray;
};

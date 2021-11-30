export const LinksChartContents = [
	{
		label: "Broken Links",
		filter: "status__neq=OK",
		color: "#f56565"
	},
	{
		label: "No Issues",
		filter: "status=OK",
		color: "#48bb78"
	}
];

export const SeoChartContents = [
	{
		label: "Missing Titles",
		filter: "has_title=false",
		color: "#f56565"
	},
	{
		label: "Missing Descriptions",
		filter: "has_description=false",
		color: "#e53e3e"
	},
	{
		label: "Missing H1s",
		filter: "has_h1_first=false",
		color: "#c53030"
	},
	{
		label: "Missing H2s",
		filter: "has_h2_first=false",
		color: "#9b2c2c"
	},
	{
		label: "No Issues",
		filter: "has_title=true&has_description=true&has_h1_first=true&has_h2_first=true",
		color: "#48bb78"
	}
];

export const PagesChartContents = [
	{
		label: "Large Page Sizes",
		filter: "size_total_min=1048576",
		color: "#f56565"
	},
	{
		label: "Broken Security",
		filter: "tls_total=false",
		color: "#e53e3e"
	},
	{
		label: "Duplicate Titles",
		filter: "has_duplicated_title=true",
		color: "#c53030"
	},
	{
		label: "Duplicate Descriptions",
		filter: "has_duplicated_description=true",
		color: "#9b2c2c"
	},
	{
		label: "No Issues",
		filter: "tls_total=true&size_total_max=1048575",
		color: "#48bb78"
	}
];

export const ImagesChartContents = [
	{
		label: "Broken Images",
		filter: "status__neq=OK",
		color: "#f56565"
	},
	{
		label: "Unsecured Images",
		filter: "tls_status__neq=OK",
		color: "#e53e3e"
	},
	{
		label: "Missing Alts",
		filter: "missing_alts__gt=0",
		color: "#c53030"
	},
	{
		label: "No Issues",
		filter: "tls_status=OK&status=OK&missing_alts__iszero=true",
		color: "#48bb78"
	}
];

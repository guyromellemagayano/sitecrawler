export const linksChartContents = [
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

export const seoChartContents = [
	{
		label: "Missing Title",
		filter: "has_title=false",
		color: "#f56565"
	},
	{
		label: "Missing Description",
		filter: "has_description=false",
		color: "#e53e3e"
	},
	{
		label: "Missing H1",
		filter: "has_h1_first=false",
		color: "#c53030"
	},
	{
		label: "Missing H2",
		filter: "has_h2_first=false",
		color: "#9b2c2c"
	},
	{
		label: "No Issues",
		filter: "has_title=true&has_description=true&has_h1_first=true&has_h2_first=true",
		color: "#48bb78"
	}
];

export const pagesChartContents = [
	{
		label: "Large Page Size",
		filter: "size_total_min=1048576",
		color: "#f56565"
	},
	{
		label: "Broken Security",
		filter: "tls_total=false",
		color: "#e53e3e"
	},
	{
		label: "No Issues",
		filter: "tls_total=true&size_total_max=1048575",
		color: "#48bb78"
	}
];

export const imagesChartContents = [
	{
		label: "Broken Images",
		filter: "status__neq=OK",
		color: "#f56565"
	},
	{
		label: "Broken Security",
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

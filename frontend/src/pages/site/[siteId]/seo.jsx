// React
import { Fragment, useState, useEffect } from "react";

// NextJS
import Link from "next/link";
import Router, { useRouter } from "next/router";

// External
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw, { styled } from "twin.macro";

// JSON
import SeoLabel from "public/labels/pages/site/seo.json";
import SeoTableContent from "public/data/seo-table.json";

// Hooks
import usePostMethod from "src/hooks/usePostMethod";
import { useScan, useSite, usePages, useSiteId, useStats } from "src/hooks/useSite";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import ChevronRightSvg from "src/components/svg/solid/ChevronRightSvg";
import HomeSvg from "src/components/svg/solid/HomeSvg";
import LinkOptions from "src/components/site/LinkOptions";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MyPagination from "src/components/sites/Pagination";
import ProfileSkeleton from "src/components/skeletons/ProfileSkeleton";
import SearchSvg from "src/components/svg/solid/SearchSvg";
import SeoFilter from "src/components/site/SeoFilter";
import SeoSorting from "src/components/site/SeoSorting";
import SeoTable from "src/components/site/SeoTable";
import SeoTableSkeleton from "src/components/skeletons/SeoTableSkeleton";

// Loadable
const Loader = loadable(() => import("src/components/layout/Loader"));
const MobileSidebarButton = loadable(() => import("src/components/sidebar/MobileSidebarButton"));
const SiteFooter = loadable(() => import("src/components/footer/SiteFooter"));
const UpgradeErrorAlert = loadable(() => import("src/components/alerts/UpgradeErrorAlert"));

// Helpers
import { removeURLParameter, slugToCamelcase, getSortKeyFromSlug, getSlugFromSortKey } from "src/helpers/functions";

const SeoDiv = styled.section`
	@media only screen and (max-width: 1600px) {
		.min-width-adjust {
			min-width: 12rem;
		}
	}
`;

const initialOrder = {
	pageUrl: "default",
	createdAt: "default",
	totalLinks: "default",
	totalOkLinks: "default",
	totalNonOkLinks: "default"
};

const Seo = ({ width, result }) => {
	const [allFilter, setAllFilter] = useState(false);
	const [crawlFinished, setCrawlFinished] = useState(false);
	const [disableLocalTime, setDisableLocalTime] = useState(false);
	const [linksPerPage, setLinksPerPage] = useState(20);
	const [loadQueryString, setLoadQueryString] = useState("");
	const [noDescription, setNoDescription] = useState(false);
	const [noH1First, setNoH1First] = useState(false);
	const [noH1Second, setNoH1Second] = useState(false);
	const [noH2First, setNoH2First] = useState(false);
	const [noH2Second, setNoH2Second] = useState(false);
	const [noIssueFilter, setNoIssueFilter] = useState(false);
	const [noTitle, setNoTitle] = useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [pagePath, setPagePath] = useState("");
	const [pagesData, setPagesData] = useState([]);
	const [recrawlable, setRecrawlable] = useState(false);
	const [scanData, setScanData] = useState([]);
	const [scanObjId, setScanObjId] = useState(0);
	const [searchKey, setSearchKey] = useState("");
	const [siteData, setSiteData] = useState([]);
	const [siteIdData, setSiteIdData] = useState([]);
	const [sortOrder, setSortOrder] = useState(initialOrder);
	const [statsData, setStatsData] = useState([]);
	const [userData, setUserData] = useState([]);

	const { asPath } = useRouter();

	const pageTitle =
		siteIdData.name && siteIdData.name !== undefined ? SeoLabel[1].label + " - " + siteIdData.name : SeoLabel[1].label;
	const homeLabel = "Home";
	const homePageLink = `/site/${result.siteId}/overview`;
	const reCrawlEndpoint = `/api/site/${result.siteId}/start_scan/`;
	const sitesApiEndpoint = `/api/site/?ordering=name`;

	let pages = [];
	let mutatePages = [];
	let scanApiEndpoint = "";
	let queryString = "";
	let hasTitleString = "";
	let hasDescriptionString = "";
	let hasH1FirstString = "";
	let hasH2FirstString = "";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
		// refreshInterval: 1000
	});

	const { scan: scan } = useScan({
		querySid: result.siteId
		// refreshInterval: 1000
	});

	const { site: site } = useSite({
		endpoint: sitesApiEndpoint
		// refreshInterval: 1000
	});

	const { siteId: siteId } = useSiteId({
		querySid: result.siteId
	});

	useEffect(() => {
		if (scan && scan !== undefined && Object.keys(scan).length > 0) {
			setScanData(scan);

			if (scanData.results && scanData.results !== undefined && Object.keys(scanData.results).length > 0) {
				setScanObjId(
					scanData.results
						.map((e) => {
							return e.id;
						})
						.sort()
						.reverse()[0]
				);
			}
		}
	});

	const { stats: stats } = useStats({
		querySid: result.siteId,
		scanObjId: scanObjId
		// refreshInterval: 1000
	});

	if (
		user &&
		user !== undefined &&
		user !== [] &&
		Object.keys(user).length > 0 &&
		user.permissions &&
		user.permissions !== undefined &&
		user.permissions.includes("can_see_images") &&
		user.permissions.includes("can_see_pages") &&
		user.permissions.includes("can_see_scripts") &&
		user.permissions.includes("can_see_stylesheets") &&
		user.permissions.includes("can_start_scan")
	) {
		scanApiEndpoint =
			result.page !== undefined
				? `/api/site/${result.siteId}/scan/${scanObjId}/page/?per_page=` + linksPerPage + `&page=` + result.page
				: `/api/site/${result.siteId}/scan/${scanObjId}/page/?per_page=` + linksPerPage;

		hasTitleString = Array.isArray(result.has_title) ? result.has_title.join("&has_title=") : result.has_title;

		queryString +=
			result.has_title !== undefined
				? scanApiEndpoint.includes("?")
					? `&has_title=${hasTitleString}`
					: `?has_title=${hasTitleString}`
				: "";

		hasDescriptionString = Array.isArray(result.has_description)
			? result.has_description.join("&has_description=")
			: result.has_description;

		queryString +=
			result.has_description !== undefined
				? scanApiEndpoint.includes("?")
					? `&has_description=${hasDescriptionString}`
					: `?has_description=${hasDescriptionString}`
				: "";

		hasH1FirstString = Array.isArray(result.has_h1_first)
			? result.has_h1_first.join("&has_h1_first=")
			: result.has_h1_first;

		queryString +=
			result.has_h1_first !== undefined
				? scanApiEndpoint.includes("?")
					? `&has_h1_first=${hasH1FirstString}`
					: `?has_h1_first=${hasH1FirstString}`
				: "";

		queryString +=
			result.has_h1_second !== undefined
				? scanApiEndpoint.includes("?")
					? `&has_h1_second=false`
					: `?has_h1_second=false`
				: "";

		hasH2FirstString = Array.isArray(result.has_h2_first)
			? result.has_h2_first.join("&has_h2_first=")
			: result.has_h2_first;

		queryString +=
			result.has_h2_first !== undefined
				? scanApiEndpoint.includes("?")
					? `&has_h2_first=${hasH2FirstString}`
					: `?has_h2_first=${hasH2FirstString}`
				: "";

		queryString +=
			result.has_h2_second !== undefined
				? scanApiEndpoint.includes("?")
					? `&has_h2_second=false`
					: `?has_h2_second=false`
				: "";

		queryString +=
			result.search !== undefined
				? scanApiEndpoint.includes("?")
					? `&search=${result.search}`
					: `?search=${result.search}`
				: "";

		queryString +=
			result.ordering !== undefined
				? scanApiEndpoint.includes("?")
					? `&ordering=${result.ordering}`
					: `?ordering=${result.ordering}`
				: "";

		queryString +=
			typeof window !== "undefined" && loadQueryString.toString() !== "" && loadQueryString.toString() !== undefined
				? scanApiEndpoint.includes("?")
					? window.location.search.replace("?", "&")
					: window.location.search
				: "";

		scanApiEndpoint += queryString;
	}

	({ pages: pages, mutatePages: mutatePages } = usePages({
		endpoint: scanApiEndpoint,
		querySid: result.siteId,
		scanObjId: scanObjId
		// refreshInterval: 1000
	}));

	useEffect(() => {
		if (user && user !== undefined && Object.keys(user).length > 0) {
			setUserData(user);

			if (userData && userData !== undefined && userData !== [] && userData.settings && userData.settings !== []) {
				if (userData.settings.disableLocalTime) {
					setDisableLocalTime(true);
				} else {
					setDisableLocalTime(false);
				}
			}
		}

		if (site && site !== undefined && Object.keys(site).length > 0) {
			setSiteData(site);
		}

		if (siteId && siteId !== undefined && Object.keys(siteId).length > 0) {
			setSiteIdData(siteId);
		}

		if (pages && pages !== undefined && Object.keys(pages).length > 0) {
			setPagesData(pages);
		}

		if (stats && stats !== undefined && Object.keys(stats).length > 0) {
			setStatsData(stats);
		}

		if (userData && siteData && siteIdData && pagesData && statsData) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user, site, siteId, pages, stats]);

	const searchEventHandler = async (e) => {
		const searchTargetValue = e.target.value;

		if (e.keyCode !== 13) return false;

		let newPath = asPath;
		newPath = removeURLParameter(newPath, "search");
		newPath = removeURLParameter(newPath, "page");

		if (!/\S/.test(searchTargetValue)) {
			setSearchKey(searchTargetValue);
		} else {
			if (newPath.includes("?")) newPath += `&search=${searchTargetValue}`;
			else newPath += `?search=${searchTargetValue}`;

			setSearchKey(searchTargetValue);
		}

		if (newPath.includes("?")) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		Router.push(newPath);
		mutatePages();
	};

	const filterChangeHandler = async (e) => {
		const filterType = e.target.value;
		const filterStatus = e.target.checked;

		let newPath = asPath;
		newPath = removeURLParameter(newPath, "page");

		if (filterType == "no-issues" && filterStatus == true) {
			setNoTitle(false);
			setNoIssueFilter(true);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_first");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?")) newPath += `&has_title=true&has_description=true&has_h1_first=true&has_h2_first=true`;
			else newPath += `?has_title=true&has_description=true&has_h1_first=true&has_h2_first=true`;
		} else if (filterType == "no-issues" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("has_title");
			loadQueryString && loadQueryString.delete("has_description");
			loadQueryString && loadQueryString.delete("has_h1_first");
			loadQueryString && loadQueryString.delete("has_h2_first");
			loadQueryString && loadQueryString.delete("page");

			if (
				newPath.includes("has_title") &&
				newPath.includes("has_description") &&
				newPath.includes("has_h1_first") &&
				newPath.includes("has_h2_first")
			) {
				newPath = removeURLParameter(newPath, "has_title");
				newPath = removeURLParameter(newPath, "has_description");
				newPath = removeURLParameter(newPath, "has_h1_first");
				newPath = removeURLParameter(newPath, "has_h2_first");
			}

			setNoIssueFilter(false);
		}

		if (filterType == "noTitle" && filterStatus == true) {
			setNoTitle(true);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_first");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?")) newPath += `&has_title=false`;
			else newPath += `?has_title=false`;
		} else if (filterType == "noTitle" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("has_title");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("has_title")) {
				newPath = removeURLParameter(newPath, "has_title");
			}

			setNoTitle(false);
		}

		if (filterType == "noDescription" && filterStatus == true) {
			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(true);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_first");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?")) newPath += `&has_description=false`;
			else newPath += `?has_description=false`;
		} else if (filterType == "noDescription" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("has_description");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("has_description")) {
				newPath = removeURLParameter(newPath, "has_description");
			}

			setNoDescription(false);
		}

		if (filterType == "noH1First" && filterStatus == true) {
			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(true);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_first");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?")) newPath += `&has_h1_first=false`;
			else newPath += `?has_h1_first=false`;
		} else if (filterType == "noH1First" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("has_h1_first");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("has_h1_first")) {
				newPath = removeURLParameter(newPath, "has_h1_first");
			}

			setNoH1First(false);
		}

		if (filterType == "noH1Second" && filterStatus == true) {
			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(true);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h2_first");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?")) newPath += `&has_h1_second=false`;
			else newPath += `?has_h1_second=false`;
		} else if (filterType == "noH1Second" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("has_h1_second");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("has_h1_second")) {
				newPath = removeURLParameter(newPath, "has_h1_second");
			}

			setNoH1Second(false);
		}

		if (filterType == "noH2First" && filterStatus == true) {
			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(true);
			setNoH2Second(false);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_second");

			if (newPath.includes("?")) newPath += `&has_h2_first=false`;
			else newPath += `?has_h2_first=false`;
		} else if (filterType == "noH2First" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("has_h2_first");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("has_h2_first")) {
				newPath = removeURLParameter(newPath, "has_h2_first");
			}

			setNoH2First(false);
		}

		if (filterType == "noH2Second" && filterStatus == true) {
			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(true);
			setAllFilter(false);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_first");

			if (newPath.includes("?")) newPath += `&has_h2_second=false`;
			else newPath += `?has_h2_second=false`;
		} else if (filterType == "noH2Second" && filterStatus == false) {
			loadQueryString && loadQueryString.delete("has_h2_second");
			loadQueryString && loadQueryString.delete("page");

			if (newPath.includes("has_h2_second")) {
				newPath = removeURLParameter(newPath, "has_h2_second");
			}

			setNoH2Second(false);
		}

		if (filterType == "all" && filterStatus == true) {
			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(true);

			newPath = removeURLParameter(newPath, "has_title");
			newPath = removeURLParameter(newPath, "has_description");
			newPath = removeURLParameter(newPath, "has_h1_first");
			newPath = removeURLParameter(newPath, "has_h1_second");
			newPath = removeURLParameter(newPath, "has_h2_first");
			newPath = removeURLParameter(newPath, "has_h2_second");

			// if (!newPath.includes("search") && !newPath.includes("ordering"))
			//   newPath = newPath.replace("?", "");
		}

		if (newPath.includes("?")) setPagePath(`${newPath}&`);
		else setPagePath(`${newPath}?`);

		Router.push(newPath);
		mutatePages();

		return true;
	};

	const onItemsPerPageChange = (count) => {
		const countValue = parseInt(count.target.value);

		let newPath = asPath;
		newPath = removeURLParameter(newPath, "page");

		if (countValue) {
			if (newPath.includes("per_page")) {
				newPath = removeURLParameter(newPath, "per_page");
			}
			if (newPath.includes("?")) newPath += `&per_page=${countValue}`;
			else newPath += `?per_page=${countValue}`;

			setLinksPerPage(countValue);

			if (newPath.includes("?")) setPagePath(`${newPath}&`);
			else setPagePath(`${newPath}?`);

			Router.push(newPath);
			mutatePages();

			return true;
		}
	};

	useEffect(() => {
		if (removeURLParameter(asPath, "page").includes("?")) setPagePath(`${removeURLParameter(asPath, "page")}&`);
		else setPagePath(`${removeURLParameter(asPath, "page")}?`);

		if (result.search !== undefined) setSearchKey(result.search);

		if (result.ordering !== undefined) {
			const slug = getSlugFromSortKey(SeoTableContent, result.ordering.replace("-", ""));
			const orderItem = slugToCamelcase(slug);

			if (result.ordering.includes("-")) setSortOrder((prevState) => ({ ...prevState, [orderItem]: "desc" }));
			else setSortOrder((prevState) => ({ ...prevState, [orderItem]: "asc" }));
		}

		if (result.per_page !== undefined) setLinksPerPage(result.per_page);

		setLoadQueryString(new URLSearchParams(window.location.search));

		let loadQueryStringValue = new URLSearchParams(window.location.search);

		if (
			loadQueryStringValue.has("has_title") &&
			loadQueryStringValue.get("has_title") === "true" &&
			loadQueryStringValue.has("has_description") &&
			loadQueryStringValue.get("has_description") === "true" &&
			loadQueryStringValue.has("has_h1_first") &&
			loadQueryStringValue.get("has_h1_first") === "true" &&
			loadQueryStringValue.has("has_h2_first") &&
			loadQueryStringValue.get("has_h2_first") === "true"
		) {
			setNoIssueFilter(true);
			setNoTitle(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);
		}

		if (loadQueryStringValue.has("has_title") && loadQueryStringValue.get("has_title") === "false") {
			setNoIssueFilter(false);
			setNoTitle(true);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);
		}

		if (loadQueryStringValue.has("has_description") && loadQueryStringValue.get("has_description") === "false") {
			setNoIssueFilter(false);
			setNoTitle(false);
			setNoDescription(true);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);
		}

		if (loadQueryStringValue.has("has_h1_first") && loadQueryStringValue.get("has_h1_first") === "false") {
			setNoIssueFilter(false);
			setNoTitle(false);
			setNoDescription(false);
			setNoH1First(true);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);
		}

		if (loadQueryStringValue.has("has_h1_second") && loadQueryStringValue.get("has_h1_second") === "false") {
			setNoIssueFilter(false);
			setNoTitle(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(true);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);
		}

		if (loadQueryStringValue.has("has_h2_first") && loadQueryStringValue.get("has_h2_first") === "false") {
			setNoIssueFilter(false);
			setNoTitle(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(true);
			setNoH2Second(false);
			setAllFilter(false);
		}

		if (loadQueryStringValue.has("has_h2_second") && loadQueryStringValue.get("has_h2_second") === "false") {
			setNoIssueFilter(false);
			setNoTitle(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(true);
			setAllFilter(false);
		}

		if (
			!loadQueryStringValue.has("has_title") &&
			!loadQueryStringValue.has("has_description") &&
			!loadQueryStringValue.has("has_h1_first") &&
			!loadQueryStringValue.has("has_h1_second") &&
			!loadQueryStringValue.has("has_h2_first") &&
			!loadQueryStringValue.has("has_h2_second")
		) {
			setNoIssueFilter(false);
			setNoTitle(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(true);
		}
	}, []);

	useEffect(() => {
		if (
			result.has_title !== undefined &&
			result.has_title.includes("true") &&
			result.has_description !== undefined &&
			result.has_description.includes("true") &&
			result.has_h1_first !== undefined &&
			result.has_h1_first.includes("true") &&
			result.has_h2_first !== undefined &&
			result.has_h2_first.includes("true")
		) {
			loadQueryString && loadQueryString.delete("has_title");
			loadQueryString && loadQueryString.delete("has_description");
			loadQueryString && loadQueryString.delete("has_h1_first");
			loadQueryString && loadQueryString.delete("has_h1_second");
			loadQueryString && loadQueryString.delete("has_h2_first");
			loadQueryString && loadQueryString.delete("has_h2_second");

			setNoTitle(false);
			setNoIssueFilter(true);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);
		}

		if (result.has_title !== undefined && result.has_title.includes("false")) {
			loadQueryString && loadQueryString.delete("has_description");
			loadQueryString && loadQueryString.delete("has_h1_first");
			loadQueryString && loadQueryString.delete("has_h1_second");
			loadQueryString && loadQueryString.delete("has_h2_first");
			loadQueryString && loadQueryString.delete("has_h2_second");

			setNoTitle(true);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);
		}

		if (result.has_description !== undefined && result.has_description.includes("false")) {
			loadQueryString && loadQueryString.delete("has_title");
			loadQueryString && loadQueryString.delete("has_h1_first");
			loadQueryString && loadQueryString.delete("has_h1_second");
			loadQueryString && loadQueryString.delete("has_h2_first");
			loadQueryString && loadQueryString.delete("has_h2_second");

			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(true);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);
		}

		if (result.has_h1_first !== undefined && result.has_h1_first.includes("false")) {
			loadQueryString && loadQueryString.delete("has_title");
			loadQueryString && loadQueryString.delete("has_description");
			loadQueryString && loadQueryString.delete("has_h1_second");
			loadQueryString && loadQueryString.delete("has_h2_first");
			loadQueryString && loadQueryString.delete("has_h2_second");

			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(true);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);
		}

		if (result.has_h1_second !== undefined && result.has_h1_second.includes("false")) {
			loadQueryString && loadQueryString.delete("has_title");
			loadQueryString && loadQueryString.delete("has_description");
			loadQueryString && loadQueryString.delete("has_h1_first");
			loadQueryString && loadQueryString.delete("has_h2_first");
			loadQueryString && loadQueryString.delete("has_h2_second");

			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(true);
			setNoH2First(false);
			setNoH2Second(false);
			setAllFilter(false);
		}

		if (result.has_h2_first !== undefined && result.has_h2_first.includes("false")) {
			loadQueryString && loadQueryString.delete("has_title");
			loadQueryString && loadQueryString.delete("has_description");
			loadQueryString && loadQueryString.delete("has_h1_first");
			loadQueryString && loadQueryString.delete("has_h1_second");
			loadQueryString && loadQueryString.delete("has_h2_second");

			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(true);
			setNoH2Second(false);
			setAllFilter(false);
		}

		if (result.has_h2_second !== undefined && result.has_h2_second.includes("false")) {
			loadQueryString && loadQueryString.delete("has_title");
			loadQueryString && loadQueryString.delete("has_description");
			loadQueryString && loadQueryString.delete("has_h1_first");
			loadQueryString && loadQueryString.delete("has_h1_second");
			loadQueryString && loadQueryString.delete("has_h2_first");

			setNoTitle(false);
			setNoIssueFilter(false);
			setNoDescription(false);
			setNoH1First(false);
			setNoH1Second(false);
			setNoH2First(false);
			setNoH2Second(true);
			setAllFilter(false);
		}

		if (loadQueryString && loadQueryString !== undefined && loadQueryString.toString().length === 0) {
			if (
				result.has_title == undefined &&
				result.has_description == undefined &&
				result.has_h1_first == undefined &&
				result.has_h1_second == undefined &&
				result.has_h2_first == undefined &&
				result.has_h2_second == undefined
			) {
				setNoTitle(false);
				setNoIssueFilter(false);
				setNoDescription(false);
				setNoH1First(false);
				setNoH1Second(false);
				setNoH2First(false);
				setNoH2Second(false);
				setAllFilter(true);
			}
		}
	}, [filterChangeHandler, loadQueryString]);

	const SortHandler = (slug, dir) => {
		setSortOrder({ ...initialOrder });

		let newPath = removeURLParameter(asPath, "ordering");

		const sortItem = slugToCamelcase(slug);
		const sortKey = getSortKeyFromSlug(SeoTableContent, slug);

		if (sortOrder[sortItem] == "default") {
			setSortOrder((prevState) => ({ ...prevState, [sortItem]: dir }));
			if (dir == "asc") {
				if (newPath.includes("?")) newPath += `&ordering=${sortKey}`;
				else newPath += `?ordering=${sortKey}`;
			} else {
				if (newPath.includes("?")) newPath += `&ordering=-${sortKey}`;
				else newPath += `?ordering=-${sortKey}`;
			}
		} else if (sortOrder[sortItem] == "asc") {
			setSortOrder((prevState) => ({ ...prevState, [sortItem]: "desc" }));
			if (newPath.includes("?")) newPath += `&ordering=-${sortKey}`;
			else newPath += `?ordering=-${sortKey}`;
		} else {
			setSortOrder((prevState) => ({ ...prevState, [sortItem]: "asc" }));
			if (newPath.includes("?")) newPath += `&ordering=${sortKey}`;
			else newPath += `?ordering=${sortKey}`;
		}

		// console.log('[pagePath]', newPath)
		if (newPath.includes("?")) setPagePath(`${removeURLParameter(newPath, "page")}&`);
		else setPagePath(`${removeURLParameter(newPath, "page")}?`);

		Router.push(newPath);
		mutatePages();
	};

	const onCrawlHandler = async () => {
		setCrawlFinished(false);

		try {
			const response = await usePostMethod(reCrawlEndpoint);
			const data = await response.data;

			if (Math.floor(response.status / 200) === 1) {
				if (data) {
					return data;
				}
			} else {
				// FIXME: report issues from here to Sentry
				return null;
			}
		} catch (error) {
			throw error.message;
		}
	};

	const crawlableHandler = (finished) => {
		if (finished) setCrawlFinished(true);

		if (
			user &&
			user.permissions !== undefined &&
			user.permissions.includes("can_start_scan") &&
			siteIdData &&
			siteIdData.verified &&
			finished
		)
			setRecrawlable(true);
		else setRecrawlable(false);
	};

	return pageLoaded ? (
		<Layout user={userData}>
			<NextSeo title={pageTitle} />

			<SeoDiv tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={userData}
					site={siteData}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				<div tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="relative flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:mb-4">
						<MobileSidebarButton openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
						<LinkOptions
							sid={result.siteId}
							user={userData}
							searchKey={searchKey}
							onSearchEvent={searchEventHandler}
							onCrawl={onCrawlHandler}
							crawlable={recrawlable}
							crawlFinished={crawlFinished}
							crawlableHandler={crawlableHandler}
						/>
					</div>

					<main tw="flex-1 relative overflow-y-auto focus:outline-none" tabIndex="0">
						<div tw="w-full p-6 mx-auto">
							{pageLoaded ? (
								<div className="max-w-full py-4 px-8">
									<nav tw="flex pt-4 pb-8" aria-label="Breadcrumb">
										<ol tw="flex items-center space-x-4">
											<li>
												<div>
													<Link href={homePageLink} passHref>
														<a tw="text-gray-400 hover:text-gray-500">
															<HomeSvg className={tw`flex-shrink-0 h-5 w-5`} />
															<span tw="sr-only">{homeLabel}</span>
														</a>
													</Link>
												</div>
											</li>
											<li>
												<div tw="flex items-center">
													<ChevronRightSvg className={tw`flex-shrink-0 h-5 w-5 text-gray-400`} />
													<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
														{pageTitle}
													</p>
												</div>
											</li>
										</ol>
									</nav>
									<div className="pt-4 m-auto">
										<h4 className="flex items-center text-2xl leading-6 font-medium text-gray-900">
											{pageTitle}
											{pagesData && pagesData !== undefined && pagesData !== [] && Object.keys(pagesData).length > 0 ? (
												<dl tw="inline-flex flex-col mb-2 lg:mb-0 lg:ml-5 sm:flex-row sm:flex-wrap">
													<dd tw="flex items-center text-base leading-5 text-gray-500 font-medium sm:mr-6">
														<SearchSvg className={tw`flex-shrink-0 mr-2 h-5 w-5 text-gray-400`} />
														{pagesData.count > 1
															? pagesData.count + " " + SeoLabel[2].label
															: pagesData.count == 1
															? pagesData.count + " " + SeoLabel[6].label
															: SeoLabel[3].label}
													</dd>
												</dl>
											) : null}
										</h4>
									</div>
								</div>
							) : (
								<ProfileSkeleton />
							)}
						</div>
						<div tw="max-w-full px-4 py-4 sm:px-6 md:px-8">
							{userData &&
							userData !== undefined &&
							userData !== [] &&
							Object.keys(userData).length > 0 &&
							userData.permissions &&
							userData.permissions !== undefined &&
							userData.permissions.includes("can_see_images") &&
							userData.permissions.includes("can_see_pages") &&
							userData.permissions.includes("can_see_scripts") &&
							userData.permissions.includes("can_see_stylesheets") &&
							userData.permissions.includes("can_start_scan") ? (
								<SeoFilter
									onFilterChange={filterChangeHandler}
									allFilter={allFilter}
									noIssueFilter={noIssueFilter}
									noTitle={noTitle}
									noDescription={noDescription}
									noH1First={noH1First}
									noH1Second={noH1Second}
									noH2First={noH2First}
									noH2Second={noH2Second}
								/>
							) : null}

							<div tw="pb-4">
								<div tw="flex flex-col">
									<div tw="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
										<div tw="align-middle inline-block min-w-full overflow-hidden rounded-lg border-gray-300">
											<table tw="min-w-full">
												<thead>
													<tr>
														{SeoTableContent.map((site, key) => {
															return (
																<Fragment key={key}>
																	<th
																		css={[
																			tw`px-6 py-3 border-b border-gray-300 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`,
																			site.slug === "url-type" || site.slug === "occurrences"
																				? "min-width-adjust"
																				: "min-w-full"
																		]}
																	>
																		<div tw="flex items-center justify-start">
																			{site.slug !== undefined ? (
																				<SeoSorting
																					sortOrder={sortOrder}
																					onSortHandler={SortHandler}
																					key={key}
																					slug={site.slug}
																					user={userData}
																				/>
																			) : null}
																			<span className="label" tw="flex items-center">
																				{site.label}
																			</span>
																		</div>
																	</th>
																</Fragment>
															);
														})}
													</tr>
												</thead>
												<tbody>
													{userData &&
													userData !== undefined &&
													userData !== [] &&
													Object.keys(userData).length > 0 &&
													userData.permissions &&
													userData.permissions !== undefined &&
													userData.permissions.includes("can_see_images") &&
													userData.permissions.includes("can_see_pages") &&
													userData.permissions.includes("can_see_scripts") &&
													userData.permissions.includes("can_see_stylesheets") &&
													userData.permissions.includes("can_start_scan") &&
													pagesData &&
													pagesData !== undefined &&
													pagesData !== [] &&
													Object.keys(pagesData).length > 0 &&
													pagesData.results ? (
														pagesData.results.map((val, key) => (
															<SeoTable
																key={key}
																val={val}
																disableLocalTime={disableLocalTime}
																user={userData}
																label={SeoLabel}
															/>
														))
													) : (
														<SeoTableSkeleton />
													)}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
							{userData &&
							userData !== undefined &&
							userData !== [] &&
							Object.keys(userData).length > 0 &&
							userData.permissions &&
							userData.permissions !== undefined &&
							userData.permissions.includes("can_see_images") &&
							userData.permissions.includes("can_see_pages") &&
							userData.permissions.includes("can_see_scripts") &&
							userData.permissions.includes("can_see_stylesheets") &&
							userData.permissions.includes("can_start_scan") &&
							pagesData &&
							pagesData !== undefined &&
							pagesData !== [] &&
							Object.keys(pagesData).length > 0 ? (
								<MyPagination
									href="/site/[siteId]/seo"
									pathName={pagePath}
									apiEndpoint={scanApiEndpoint}
									page={result.page ? result.page : 0}
									linksPerPage={linksPerPage}
									onItemsPerPageChange={onItemsPerPageChange}
								/>
							) : null}
						</div>

						<div tw="static bottom-0 w-full mx-auto px-12 py-4">
							<SiteFooter />
						</div>

						{userData &&
							userData !== undefined &&
							userData !== [] &&
							Object.keys(userData).length > 0 &&
							userData.permissions &&
							userData.permissions !== undefined &&
							!userData.permissions.includes("can_see_images") &&
							!userData.permissions.includes("can_see_pages") &&
							!userData.permissions.includes("can_see_scripts") &&
							!userData.permissions.includes("can_see_stylesheets") &&
							!userData.permissions.includes("can_start_scan") && (
								<UpgradeErrorAlert link="/settings/subscription-plans" />
							)}
					</main>
				</div>
			</SeoDiv>
		</Layout>
	) : (
		<Loader />
	);
};

Seo.propTypes = {};

export default withResizeDetector(Seo);

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}

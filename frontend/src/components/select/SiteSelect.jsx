// React
import * as React from "react";

// External
import "twin.macro";
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// Hooks
import useDropdownOutsideClick from "@hooks/useDropdownOutsideClick";

// Components
const SiteSelectMenu = loadable(() => import("@components"), {
	resolveComponent: (components) => components.SiteSelectMenu
});
const SiteSelectDropdown = loadable(() => import("@components"), {
	resolveComponent: (components) => components.SiteSelectDropdown
});

const SiteSelect = ({ site, siteId, currentScan }) => {
	const [selectedSite, setSelectedSite] = React.useState(null);
	const [selectedSiteDetails, setSelectedSiteDetails] = React.useState([]);
	const [selectedSiteId, setSelectedSiteId] = React.useState(null);

	const { ref, isComponentVisible, setIsComponentVisible } = useDropdownOutsideClick(false);

	const handleSiteSelectOnLoad = (siteId) => {
		site?.results
			? (() => {
					for (let i = 0; i < site?.results.length; i++) {
						if (site?.results[i]?.id == siteId) {
							setSelectedSite(site?.results[i]?.name);
							setIsComponentVisible(!isComponentVisible);

							setSelectedSiteId(siteId);
						}
					}
			  })()
			: null;
	};

	React.useEffect(() => {
		site?.results
			? (() => {
					for (let i = 0; i < site?.results.length; i++) {
						if (site?.results[i]?.id == siteId) {
							setSelectedSite(site?.results[i]?.name);
						}
					}
			  })()
			: null;
	}, [site, siteId]);

	React.useEffect(() => {
		site?.results
			? site?.results
					.filter((result) => result?.name === selectedSite)
					.map((val) => {
						setSelectedSiteDetails(val);
					})
			: null;

		selectedSite
			? site?.results
				? () => {
						let currentSite = site?.results.find((result) => result?.id === parseInt(siteId));

						if (currentSite !== undefined) {
							setSelectedSite(currentSite?.name);
						}
				  }
				: null
			: null;
	}, [selectedSite, site, siteId]);

	return (
		<div tw="space-y-1">
			<div ref={ref} tw="relative">
				<div tw="relative">
					<span tw="inline-block w-full rounded-md shadow-sm">
						<SiteSelectMenu
							currentScan={currentScan}
							selectedSite={selectedSite}
							selectedSiteDetails={selectedSiteDetails}
							handleIsComponentVisible={() => setIsComponentVisible(!isComponentVisible)}
						/>
					</span>

					<SiteSelectDropdown
						site={site}
						selectedSiteId={selectedSiteId}
						handleSiteSelectOnLoad={handleSiteSelectOnLoad}
						isComponentVisible={isComponentVisible}
					/>
				</div>
			</div>
		</div>
	);
};

SiteSelect.propTypes = {
	site: PropTypes.object,
	siteId: PropTypes.number,
	currentScan: PropTypes.object
};

export default SiteSelect;

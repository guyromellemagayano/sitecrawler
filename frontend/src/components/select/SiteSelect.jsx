// React
import * as React from "react";

// External
import "twin.macro";
import PropTypes from "prop-types";

// Hooks
import { useComponentVisible } from "@hooks/useComponentVisible";

// Components
import SiteSelectDropdown from "@components/dropdowns/SiteSelectDropdown";
import SiteSelectMenu from "@components/menus/SiteSelectMenu";

const SiteSelect = ({ site, siteId, currentScan }) => {
	const [selectedSite, setSelectedSite] = React.useState(null);
	const [selectedSiteDetails, setSelectedSiteDetails] = React.useState([]);
	const [selectedSiteId, setSelectedSiteId] = React.useState(null);

	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

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
							isComponentVisible={isComponentVisible}
							setIsComponentVisible={setIsComponentVisible}
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
	currentScan: PropTypes.object,
	results: PropTypes.array,
	siteId: PropTypes.number
};

SiteSelect.defaultProps = {
	currentScan: null,
	results: null,
	siteId: null
};

export default SiteSelect;

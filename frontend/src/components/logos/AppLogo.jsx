// React
import * as React from "react";

// External
import "twin.macro";
import PropTypes from "prop-types";

// Components
import AppImage from "src/components/images/AppImage";

const AppLogo = ({ src, alt, width, height, "data-tw": dataTw }) => {
	return (
		<div tw="flex w-auto">
			<AppImage src={src} alt={alt} width={width} height={height} className={dataTw} />
		</div>
	);
};

AppLogo.propTypes = {};

export default AppLogo;

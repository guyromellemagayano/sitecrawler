// React
import * as React from "react";

// NextJS
import Image from "next/image";

// External
import PropTypes from "prop-types";

const AppImage = (props) => {
	return (
		<span className={props.className}>
			<Image src={props.src} alt={props.alt} width={props.width} height={props.height} />
		</span>
	);
};

AppImage.propTypes = {};

export default AppImage;

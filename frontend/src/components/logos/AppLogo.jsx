// NextJS
import Image from "next/image";

// External
import "twin.macro";
import PropTypes from "prop-types";

const AppLogo = ({ "data-tw": dataTw, src, alt, width, height }) => {
	return (
		<div tw="flex max-w-full">
			<span className={dataTw}>
				<Image src={src} alt={alt} width={width} height={height} />
			</span>
		</div>
	);
};

AppLogo.propTypes = {};

export default AppLogo;

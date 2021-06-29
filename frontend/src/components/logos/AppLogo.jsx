// NextJS
import Image from "next/image";
import Link from "next/link";

// External
import "twin.macro";
import PropTypes from "prop-types";

const AppLogo = (props) => {
	const homePageLink = "/sites/";
	const appLogoWidth = 300;
	const appLogoHeight = 51;

	return (
		<Link href={homePageLink} passHref>
			<a css={props.className} title="">
				<Image src={props.src} alt={props.alt} width={appLogoWidth} height={appLogoHeight} />
			</a>
		</Link>
	);
};

AppLogo.propTypes = {};

export default AppLogo;

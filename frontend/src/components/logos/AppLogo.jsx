// NextJS
import Image from "next/image";
import Link from "next/link";

// External
import tw, { styled } from "twin.macro";
import PropTypes from "prop-types";

const AppLogoLink = styled.a`
	${tw`flex items-center justify-center max-w-full`}
`;

const AppLogo = (props) => {
	const homePageLink = "/sites/";

	return (
		<Link href={homePageLink} passHref>
			<AppLogoLink css={props.className}>
				<Image src={props.src} alt={props.alt} width={props.width} height={props.height} />
			</AppLogoLink>
		</Link>
	);
};

AppLogo.propTypes = {};

export default AppLogo;

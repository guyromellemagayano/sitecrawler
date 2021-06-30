// NextJS
import Image from "next/image";

// External
import tw, { styled } from "twin.macro";
import PropTypes from "prop-types";

const AppLogoLink = styled.span`
	${tw`flex items-center justify-center max-w-full`}
`;

const AppLogo = (props) => {
	return (
		<AppLogoLink css={props.className}>
			<Image src={props.src} alt={props.alt} width={props.width} height={props.height} />
		</AppLogoLink>
	);
};

AppLogo.propTypes = {};

export default AppLogo;

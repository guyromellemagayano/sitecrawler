import { SiteCrawlerAppWrapper } from "contexts/AppWrapper";

const SiteCrawlerApp = ({ Component, pageProps, err }) => {
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout || ((page) => page);

	return getLayout(
		<SiteCrawlerAppWrapper>
			<Component {...pageProps} err={err} />
		</SiteCrawlerAppWrapper>
	);
};

export default SiteCrawlerApp;

import Document, { Head, Html } from "next/document";
import Script from "next/script";
import * as React from "react";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const sheet = new ServerStyleSheet();
		const originalRenderPage = ctx.renderPage;

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />)
				});
			const initialProps = await Document.getInitialProps(ctx);

			return {
				...initialProps,
				styles: (
					<React.Fragment>
						{initialProps.styles}
						{sheet.getStyleElement()}
					</React.Fragment>
				)
			};
		} finally {
			sheet.seal();
		}
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<Script src="/scripts/beacon.js" strategy="lazyOnload" />
					<Script src="/scripts/usetiful.js" strategy="beforeInteractive" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

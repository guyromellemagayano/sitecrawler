/* eslint-disable react-hooks/exhaustive-deps */
import { MemoizedAlert } from "@components/alerts";
import { DashboardSitesLink } from "@constants/PageLinks";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext, useEffect } from "react";

/**
 * Custom function to render the `StaticLayout` component
 *
 * @param {any} children
 */
export const StaticLayout = ({ children }) => {
	// Router
	const { prefetch } = useRouter();

	// Custom context
	const { state } = useContext(SiteCrawlerAppContext);

	useEffect(() => {
		// Prefetch sites page for faster loading
		prefetch(DashboardSitesLink);
	}, []);

	return (
		<>
			{state?.responses?.length > 0 && state?.isAlert ? (
				<div
					aria-live="assertive"
					className={classnames(
						"right-5 top-5 bottom-5 z-50 flex w-full max-w-xs flex-col items-end justify-end gap-4 overflow-y-auto",
						state?.responses?.length > 0 && state?.isAlert ? "fixed" : "hidden"
					)}
				>
					<div className="flex w-full flex-col items-center space-y-4 sm:items-end">
						{state.responses.map((value, key) => {
							// Alert Messsages
							const responseText = value.responseText ?? null;
							const isSuccess = value.isSuccess ?? null;

							return <MemoizedAlert key={key} responseText={responseText} isSuccess={isSuccess} />;
						}) ?? null}
					</div>
				</div>
			) : null}

			<main className="h-screen w-full">{children}</main>
		</>
	);
};

StaticLayout.propTypes = {
	children: PropTypes.any
};

/**
 * Memoized custom `StaticLayout` component
 */
export const MemoizedStaticLayout = memo(StaticLayout);

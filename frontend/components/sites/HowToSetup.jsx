import { MemoizedHowToSetupSkeleton } from "@components/skeletons/HowToSetupSkeleton";
import { HowToSetupData } from "@constants/HowToSetup";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ReactPlayer from "react-player/lazy";

/**
 * Custom function to render the `HowToSetup` component
 */
const HowToSetup = () => {
	const [tabActive, setTabActive] = useState(1);

	// Translations
	const { t } = useTranslation();
	const howToSetupHeadline = t("sites:howToSetup.headline");
	const howToSetupSubheadline = t("sites:howToSetup.subHeadline");
	const tabSrOnly = t("sites:howToSetup.tabSrOnly");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser();

	return isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
		<div className="flex-auto">
			<div className="w-full xl:max-w-screen-sm xl:flex-none xl:flex-grow-0">
				<div className="relative py-6 px-4 sm:px-6 lg:px-8 lg:py-0">
					<div className="mx-auto w-full max-w-7xl">
						<div className="mb-10 text-center">
							<h3 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 sm:text-3xl sm:leading-10">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									howToSetupHeadline
								) : (
									<Skeleton duration={2} width={120} height={30} />
								)}
							</h3>
							<p className="mx-auto mt-3 max-w-2xl text-base leading-6 text-gray-500 sm:mt-4">
								{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									howToSetupSubheadline
								) : (
									<Skeleton duration={2} width={200} height={30} />
								)}
							</p>
						</div>
						<div className="relative mx-auto mb-8 w-full rounded-lg lg:max-w-md">
							{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
								HowToSetupData.map(({ id, video }, key) => {
									return tabActive === id ? (
										<ReactPlayer key={key} url={video.src} width={"auto"} height={320} controls={true} />
									) : null;
								})
							) : (
								<Skeleton duration={2} height={260} />
							)}
						</div>
						<div>
							<div className="sm:hidden">
								<label htmlFor="tabs" className="sr-only">
									{tabSrOnly}
								</label>
								{isComponentReady ? (
									<select
										id="tabs"
										name="tabs"
										aria-label="Selected tab"
										className="block w-full space-x-3 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
									>
										{HowToSetupData.map(({ title, defaultValue }) => {
											return (
												<option key={title} selected={defaultValue}>
													{title}
												</option>
											);
										})}
									</select>
								) : (
									<div className="block w-full space-x-3">
										{HowToSetupData.map(({ title }) => {
											return <Skeleton key={title} duration={2} width={100} height={30} />;
										})}
									</div>
								)}
							</div>
							<div className="hidden sm:block">
								<nav className="flex justify-center space-x-3">
									{HowToSetupData.map(({ title, id }, key) =>
										isComponentReady ? (
											<TabItem
												key={key}
												id={id}
												title={title}
												onItemClicked={() => setTabActive(id)}
												isTabActive={tabActive === id}
											/>
										) : (
											<Skeleton key={key} duration={2} width={100} height={30} />
										)
									)}
								</nav>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div className="flex-auto">
			<MemoizedHowToSetupSkeleton />
		</div>
	);
};

/**
 * Custom function to render the `TabItem` component
 */
const TabItem = ({
	id = "",
	title = "",
	onItemClicked = () => console.error("You passed no action to the component"),
	isTabActive = false
}) => {
	return (
		<a
			href="#"
			className={classnames(
				"rounded-md text-sm font-medium leading-5",
				isTabActive
					? "bg-indigo-600 text-white focus:bg-indigo-600 focus:outline-none"
					: "text-gray-500 hover:text-gray-700 focus:bg-gray-100 focus:text-gray-700 focus:outline-none",
				id !== 1 ? "ml-2 px-3 py-2" : "px-3 py-2"
			)}
			aria-current="page"
			onClick={onItemClicked}
		>
			{title}
		</a>
	);
};

/**
 * Memoized custom `HowToSetup` component
 */
export const MemoizedHowToSetup = memo(HowToSetup);

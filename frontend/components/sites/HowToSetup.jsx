/* eslint-disable jsx-a11y/anchor-is-valid */
import { HowToSetupData } from "@constants/HowToSetup";
import { useLoading } from "@hooks/useLoading";
import useTranslation from "next-translate/useTranslation";
import { memo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ReactPlayer from "react-player/lazy";
import tw from "twin.macro";

/**
 * Custom function to render the `HowToSetup` component
 */
export function HowToSetup() {
	const [tabActive, setTabActive] = useState(1);

	// Translations
	const { t } = useTranslation();
	const howToSetupHeadline = t("addSite:howToSetup.headline");
	const howToSetupSubheadline = t("addSite:howToSetup.subHeadline");
	const tabSrOnly = t("addSite:howToSetup.tabSrOnly");

	// Custom hooks
	const { isComponentReady } = useLoading();

	return (
		<div tw="w-full xl:flex-grow-0 xl:flex-none xl:max-w-screen-sm">
			<div tw="relative py-6 px-4 sm:px-6 lg:px-8 lg:py-0">
				<div tw="max-w-7xl mx-auto">
					<div tw="text-center mb-10">
						<h3 tw="text-2xl leading-9 tracking-tight font-bold text-gray-900 sm:text-3xl sm:leading-10">
							{isComponentReady ? howToSetupHeadline : <Skeleton duration={2} width={120} height={30} />}
						</h3>
						<p tw="mt-3 max-w-2xl mx-auto text-base leading-6 text-gray-500 sm:mt-4">
							{isComponentReady ? howToSetupSubheadline : <Skeleton duration={2} width={200} height={30} />}
						</p>
					</div>
					<div tw="relative mx-auto w-full rounded-lg lg:max-w-md mb-8">
						{isComponentReady ? (
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
						<div tw="sm:hidden">
							<label htmlFor="tabs" className="sr-only">
								{tabSrOnly}
							</label>
							{isComponentReady ? (
								<select
									id="tabs"
									name="tabs"
									aria-label="Selected tab"
									tw="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md space-x-3"
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
								<div tw="block w-full space-x-3">
									{HowToSetupData.map(({ title }) => {
										return <Skeleton key={title} duration={2} width={100} height={30} />;
									})}
								</div>
							)}
						</div>
						<div tw="hidden sm:block">
							<nav tw="flex justify-center space-x-3">
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
	);
}

const TabItem = ({
	id = "",
	title = "",
	onItemClicked = () => console.error("You passed no action to the component"),
	isTabActive = false
}) => {
	return (
		<a
			href="#"
			css={[
				tw`font-medium text-sm leading-5 rounded-md`,
				isTabActive
					? tw`text-white bg-indigo-600 focus:outline-none focus:bg-indigo-600`
					: tw`text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 focus:bg-gray-100`,
				id !== 1 ? tw`ml-2 px-3 py-2` : tw`px-3 py-2`
			]}
			aria-current="page"
			onClick={onItemClicked}
		>
			{title}
		</a>
	);
};

export const MemoizedHowToSetup = memo(HowToSetup);

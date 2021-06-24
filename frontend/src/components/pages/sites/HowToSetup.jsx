// React
import * as React from "react";

// External
import tw from "twin.macro";
import loadable from "@loadable/component";
import ReactPlayer from "react-player/lazy";

// JSON
import HowToSetupLabel from "public/labels/components/sites/HowToSetup.json";

// Loadable
const HowToSetupSkeleton = loadable(() => import("src/components/skeletons/HowToSetupSkeleton"));

const tabItems = [
	{
		id: 1,
		title: "WordPress",
		video: {
			src: "https://youtu.be/FKTOwvjJmlY"
		},
		defaultvalue: true
	},
	{
		id: 2,
		title: "BigCommerce",
		video: {
			src: "https://youtu.be/Pgoj-AwHOiM"
		},
		defaultvalue: false
	}
];

const HowToSetup = () => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [tabActive, setTabActive] = React.useState(1);

	React.useEffect(() => {
		setTimeout(() => {
			setComponentReady(true);
		}, 500);

		return setComponentReady(false);
	}, []);

	return componentReady ? (
		<div tw="relative py-6 px-4 sm:px-6 lg:px-8">
			<div tw="max-w-7xl mx-auto">
				<div tw="text-center mb-10">
					<h3 tw="text-2xl leading-9 tracking-tight font-bold text-gray-900 sm:text-3xl sm:leading-10">
						{HowToSetupLabel[0].label}
					</h3>
					<p tw="mt-3 max-w-2xl mx-auto text-base leading-6 text-gray-500 sm:mt-4">{HowToSetupLabel[1].label}</p>
				</div>
				<div tw="relative mx-auto w-full rounded-lg lg:max-w-md mb-8">
					{tabItems.map(({ id, video }) => {
						return tabActive === id ? (
							<ReactPlayer key={id} url={video.src} width={"auto"} height={320} controls={true} />
						) : null;
					})}
				</div>
				<div>
					<div tw="sm:hidden">
						<label htmlFor="tabs" className="sr-only">
							Platform select tabs
						</label>
						<select
							id="tabs"
							name="tabs"
							aria-label="Selected tab"
							tw="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
						>
							{tabItems.map(({ title, defaultValue }, key) => (
								<option key={key} selected={defaultValue}>
									{title}
								</option>
							))}
						</select>
					</div>
					<div tw="hidden sm:block">
						<nav tw="flex justify-center">
							{tabItems.map(({ title, id }, key) => (
								<TabItem
									key={key}
									id={id}
									title={title}
									onItemClicked={() => setTabActive(id)}
									isTabActive={tabActive === id}
								/>
							))}
						</nav>
					</div>
				</div>
			</div>
		</div>
	) : (
		<HowToSetupSkeleton />
	);
};

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

export default HowToSetup;

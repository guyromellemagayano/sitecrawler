// React
import * as React from "react";

// External
import { styled } from "twin.macro";

// JSON
import SiteReverifyMessageLabel from "./labels/SiteReverifyMessage.json";

const SiteReverifyMessageDiv = styled.div``;

const SiteReverifyMessage = () => {
	return (
		<SiteReverifyMessageDiv tw="mx-auto">
			<section tw="flex flex-col justify-center min-h-screen">
				<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
					<h3 tw="text-lg leading-6 font-medium text-gray-500">{SiteReverifyMessageLabel[0].label}</h3>
				</div>
			</section>
		</SiteReverifyMessageDiv>
	);
};

export default SiteReverifyMessage;

// React
import React from 'react';

// External
import tw from 'twin.macro';

// Components
import CheckCircleSvg from 'src/components/svg/CheckCircleSvg';

const SuccessMessageAlert = ({ message }) => (
	<div tw="rounded-md bg-green-100 p-4 mb-8">
		<div tw="flex">
			<div tw="flex-shrink-0">
				<CheckCircleSvg className={tw`h-5 w-5 text-green-400`} />
			</div>
			<div tw="ml-3">
				<h3 tw="text-sm leading-5 font-medium text-green-800 break-words">
					{message}
				</h3>
			</div>
		</div>
	</div>
);

export default SuccessMessageAlert;

// React
import React from 'react';

// External
import tw from 'twin.macro';

// Components
import XCircleSvg from 'src/components/svg/XCircleSvg';

const ErrorMessageAlert = ({ message }) => (
	<div tw="rounded-md bg-red-100 p-4 mb-8">
		<div tw="flex">
			<div tw="flex-shrink-0">
				<XCircleSvg className={tw`h-5 w-5 text-red-400`} />
			</div>
			<div tw="ml-3">
				<h3 tw="text-sm leading-5 font-medium text-red-800 break-words">
					{message}
				</h3>
			</div>
		</div>
	</div>
);

export default ErrorMessageAlert;

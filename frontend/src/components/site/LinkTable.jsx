import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import ReactTooltip from 'react-tooltip';
import Cookies from 'js-cookie';
import tw from 'twin.macro';
import Url from 'url-parse';
import Skeleton from 'react-loading-skeleton';
import SiteDangerBadge from '../badges/SiteDangerBadge';
import SiteSuccessBadge from '../badges/SiteSuccessBadge';
import SiteWarningBadge from '../badges/SiteWarningBadge';

const fetcher = async (url) => {
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-CSRFToken': Cookies.get('csrftoken')
		}
	});

	const data = await res.json();

	if (res.status !== 200) {
		throw new Error(data.message);
	}

	return data;
};

const LinkTableDiv = styled.tbody`
	.HTTP_ERROR-tooltip {
		max-width: 20rem;
		margin-left: 5px !important;
		padding: 1rem 1.5rem;
	}
	td {
		& > div {
			max-width: 100%;
			display: block;

			& > div {
				max-width: 100%;
				display: block;
			}
		}
	}
	.link-item {
		max-width: 100%;
		display: block;

		a {
			max-width: 100%;
			display: block;
		}
	}

	.truncate-link {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 7rem;
	}

	.btn-detail {
		display: inline-block;
		padding: 8px 10px;
		line-height: 1;
		font-size: 0.7rem;
		margin-top: 5px;
	}
`;

const LinkTable = (props) => {
	const { query } = useRouter();
	const { data: linkDetail, error: linkDetailError } = useSWR(
		() =>
			query.siteId
				? `/api/site/${query.siteId}/scan/${props.val.scan_id}/link/${props.val.id}/`
				: null,
		fetcher
	);

	if (linkDetailError) return <div>{linkDetailError.message}</div>;

	if (!linkDetail) {
		return (
			<Fragment>
				<LinkTableDiv className={`bg-white`}>
					<tr>
						{[...Array(6)].map((val, index) => (
							<td
								className={`flex-none px-6 whitespace-no-wrap border-b border-gray-300`}
								key={index}
							>
								<Skeleton duration={2} />
							</td>
						))}
					</tr>
				</LinkTableDiv>
			</Fragment>
		);
	}

	return (
		<LinkTableDiv className={`bg-white`}>
			<tr>
				<td
					className={`flex-none pl-16 pr-6 py-4 whitespace-no-wrap border-b border-gray-300`}
				>
					<div className={`flex items-center`}>
						<div>
							<div
								className={`link-item text-sm leading-5 font-medium text-gray-900`}
							>
								<a
									href={props.val.url}
									target={`_blank`}
									title={props.val.url}
									className={`text-sm leading-6 font-semibold text-blue-1000 hover:text-blue-900 transition ease-in-out duration-150 truncate`}
								>
									{props.val.url}
								</a>
							</div>
							<div
								className={`flex justify-start inline-text-sm leading-5 text-gray-500`}
							>
								<Link
									href="/dashboard/site/[siteId]/links/[linkId]/details"
									as={`/dashboard/site/${query.siteId}/links/${linkDetail.id}/details`}
								>
									<a
										className={`btn-detail mr-3 outline-none focus:outline-none text-sm leading-6 font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-500 hover:border-0 transition ease-in-out duration-150`}
									>
										View Details
									</a>
								</Link>
							</div>
						</div>
					</div>
				</td>
				<td
					className={`pl-16 pr-6 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500`}
				>
					{props.val.type === 'PAGE'
						? 'Internal'
						: props.val.type === 'EXTERNAL'
						? 'External'
						: 'Other'}
				</td>
				<td
					className={`pl-16 pr-6 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500`}
				>
					{props.val.status === 'OK' ? (
						<SiteSuccessBadge text={'OK'} />
					) : props.val.status === 'TIMEOUT' ? (
						<SiteWarningBadge text={'TIMEOUT'} />
					) : props.val.status === 'HTTP_ERROR' ? (
						<Fragment>
							<span className={`flex items-center justify-start`}>
								<SiteDangerBadge text={`${props.val.http_status} HTTP ERROR`} />
								<a
									data-tip={``}
									data-for={props.val.url}
									data-background-color={'#E53E3E'}
									data-iscapture={true}
									data-scroll-hide={false}
									className={`flex cursor-pointer`}
								>
									<span className={`ml-2 inline-block w-4 h-4 overflow-hidden`}>
										<svg
											fill="currentColor"
											viewBox="0 0 20 20"
											className={`text-red-400`}
										>
											<path
												fillRule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
												clipRule="evenodd"
											></path>
										</svg>
									</span>
								</a>
								<ReactTooltip
									id={props.val.url}
									className={`${props.val.status + '-tooltip'} w-36`}
									type={`dark`}
									effect={`solid`}
									place={`bottom`}
									clickable={true}
									multiline={true}
								>
									<span
										className={`text-left text-xs leading-4 font-normal text-white normal-case tracking-wider`}
									>
										<p>
											<strong>{props.val.error}</strong>
										</p>
									</span>
								</ReactTooltip>
							</span>
						</Fragment>
					) : (
						<SiteDangerBadge text={'OTHER ERROR'} />
					)}
				</td>
				<td
					className={`px-6 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500`}
				>
					{linkDetail.pages.length !== 0 ? (
						<Link
							href="/dashboard/site/[siteId]/links/[linkId]/details"
							as={`/dashboard/site/${query.siteId}/links/${linkDetail.id}/details`}
						>
							<a
								className={`mr-3 flex items-center outline-none focus:outline-none text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
							>
								<span className={`truncate-link`}>
									{linkDetail.pages[0] &&
									Url(linkDetail.pages[0].url).pathname !== '' ? (
										Url(linkDetail.pages[0].url).pathname
									) : (
										<em>_domain</em>
									)}
								</span>
								&nbsp;
								{linkDetail.pages.length - 1 > 0
									? '+' + parseInt(linkDetail.pages.length - 1)
									: null}{' '}
								{linkDetail.pages.length - 1 > 1
									? 'others'
									: linkDetail.pages.length - 1 === 1
									? 'other'
									: null}
							</a>
						</Link>
					) : (
						''
					)}
				</td>
				<td
					className={`pl-16 pr-6 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500`}
				>
					{props.val.occurences}
				</td>
			</tr>
		</LinkTableDiv>
	);
};

export default LinkTable;

LinkTable.propTypes = {};

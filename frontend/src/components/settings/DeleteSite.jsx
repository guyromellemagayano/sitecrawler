import { Fragment, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { Transition } from '@tailwindui/react';
import Cookies from 'js-cookie';
import fetch from 'node-fetch';
import SettingsLabel from 'public/label/pages/site/settings.json';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const DeleteSiteDiv = styled.div``;

const DeleteSite = (props) => {
	const [showModal, setShowModal] = useState(false);

	const deleteSiteSettings = async (endpoint) => {
		const redirectTo = '/dashboard/sites';

		await fetch(endpoint, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': Cookies.get('csrftoken')
			}
		});

		setTimeout(() => Router.push(redirectTo), 150);
	};

	const handleSiteDeletion = async (e) => {
		e.preventDefault();

		await deleteSiteSettings(`/api/site/${props.querySiteId}/`);
	};

	return (
		<Fragment>
			<Transition show={showModal}>
				<div
					className={`fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center`}
				>
					<Transition.Child
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-100'
					>
						<div className={`fixed inset-0 transition-opacity`}>
							<div className={`absolute inset-0 bg-gray-500 opacity-75`}></div>
						</div>
					</Transition.Child>
					<span
						className={`hidden sm:inline-block sm:align-middle sm:h-screen`}
					></span>
					&#8203;
					<Transition.Child
						enter='ease-out duration-300'
						enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						enterTo='opacity-100 translate-y-0 sm:scale-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 translate-y-0 sm:scale-100'
						leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
					>
						<div
							className={`bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xs-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6`}
							role='dialog'
							aria-modal='true'
							aria-labelledby='modal-headline'
						>
							<div className={`sm:flex sm:items-start`}>
								<div
									className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10`}
								>
									<svg
										className={`h-6 w-6 text-red-600`}
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
										/>
									</svg>
								</div>
								<div
									className={`mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left`}
								>
									<h3
										className={`text-lg leading-6 font-medium text-gray-900`}
										id='modal-headline'
									>
										{SettingsLabel[9].label}
									</h3>
									<div className={`mt-2`}>
										<p className={`text-sm leading-5 text-gray-500`}>
											{SettingsLabel[11].label}
										</p>
									</div>
								</div>
							</div>
							<div className={`mt-5 sm:mt-4 sm:flex sm:flex-row-reverse`}>
								<span
									className={`flex w-full rounded-md shadow-xs-sm sm:ml-3 sm:w-auto`}
								>
									<button
										type='button'
										className={`inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-xs-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-xs-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
										onClick={(e) => handleSiteDeletion(e)}
									>
										{SettingsLabel[12].label}
									</button>
								</span>
								<span
									className={`mt-3 flex w-full rounded-md shadow-xs-sm sm:mt-0 sm:w-auto`}
								>
									<button
										type='button'
										className={`inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-xs-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-xs-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
										onClick={() =>
											setTimeout(() => setShowModal(!showModal), 150)
										}
									>
										{SettingsLabel[13].label}
									</button>
								</span>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Transition>

			<DeleteSiteDiv
				className={`max-w-full bg-white shadow-xs rounded-lg mb-5`}
			>
				<div className={`px-4 py-5 sm:p-6`}>
					<div>
						<div>
							<div>
								<h3 className={`text-lg leading-6 font-medium text-gray-900`}>
									{SettingsLabel[9].label}
								</h3>
								<p className={`mt-1 text-sm leading-5 text-gray-500`}>
									{SettingsLabel[10].label}
								</p>
							</div>
						</div>
					</div>
					<div
						className={`mt-8 border-t border-gray-300 pt-5 flex justify-between`}
					>
						<div className={`flex justify-start`}>
							<span className={`inline-flex rounded-md shadow-xs-sm`}>
								<button
									type={`button`}
									id={`siteDeleteModalButton`}
									className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-xs-outline-red active:bg-red-700`}
									onClick={() =>
										setTimeout(() => setShowModal(!showModal), 150)
									}
								>
									{SettingsLabel[12].label}
								</button>
							</span>
						</div>
					</div>
				</div>
			</DeleteSiteDiv>
		</Fragment>
	);
};

export default DeleteSite;

DeleteSite.propTypes = {
	showModal: PropTypes.bool,
	deleteSiteSettings: PropTypes.func,
	handleSiteDeletion: PropTypes.func
};

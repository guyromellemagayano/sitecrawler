import { useState } from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player/lazy'

const tabItems = [
	{
		"id": 1,
		"title": "WordPress",
		"video": {
			"src": "https://www.youtube.com/watch?v=vI25nMmklwE&t=128s"
		}
	},
	{
		"id": 2,
		"title": "Shopify",
		"video": {
			"src": "https://www.youtube.com/watch?v=KOwKOT79uiA"
		}
	},
	{
		"id": 3,
		"title": "BigCommerce",
		"video": {
			"src": "https://www.youtube.com/watch?v=8CTxbQ6cdUw"
		}
	}
]

const HowToSetupDiv = styled.div``

const HowToSetup = () => {
	const [tabActive, setTabActive] = useState(1)

	return (
    <HowToSetupDiv
      className={`relative bg-gray-50 pt-12 pb-16 px-4 sm:px-6 lg:pt-16 lg:pb-20 lg:px-8`}
    >
      <div className={`absolute inset-0`}>
        <div className={`bg-white h-1/3 sm:h-2/3`}></div>
      </div>
      <div className={`relative max-w-7xl mx-auto`}>
        <div className={`text-center mb-10`}>
          <h3
            className={`text-2xl leading-9 tracking-tight font-extrabold text-gray-900 sm:text-3xl sm:leading-10`}
          >
            How to add site
          </h3>
          <p
            className={`mt-3 max-w-2xl mx-auto text-md leading-6 text-gray-500 sm:mt-4`}
          >
            Capitalize on low hanging fruit to identify a ballpark value added
            activity to beta test.
          </p>
        </div>
        <div
          className={`relative mx-auto w-full rounded-lg shadow-xs-lg lg:max-w-md mb-8`}
        >
					{tabItems.map(({ id, video }) => {
						return tabActive === id ? (
							<ReactPlayer 
								key={id}
								url={video.src}
								width={'auto'}
								height={240}
								controls={true}
							/>
						) : null
					})}
        </div>
        <div>
          <div className={`sm:hidden`}>
            <select
              aria-label="Selected tab"
              className={`form-select block w-full`}
            >
              <option defaultValue>WordPress</option>
              <option>Shopify</option>
              <option>BigCommerce</option>
            </select>
          </div>
          <div className={`hidden sm:block`}>
            <nav className={`flex justify-center`}>
							{tabItems.map(({ id, title }) => (
								<TabItem
									key={id}
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
    </HowToSetupDiv>
  );
}

const TabItem = ({
	id = '',
	title = '',
	onItemClicked = () => console.error('You passed no action to the component'),
	isTabActive = false
}) => {
	return (
		<a
			href="#"
			className={`${isTabActive ? "text-white bg-indigo-600 focus:outline-none focus:bg-indigo-600" : "text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 focus:bg-gray-100"} ${id !== 1 ? "ml-2 px-3 py-2" : "px-3 py-2"} font-medium text-sm leading-5 rounded-md `}
			aria-current="page"
			onClick={onItemClicked}
		>
			{title}
		</a>
	)
}

export default HowToSetup
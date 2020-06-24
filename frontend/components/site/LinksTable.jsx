import Link from 'next/link'
import styled from 'styled-components'

const LinksTableDiv = styled.tbody``

const LinksTable = props => {    
  return (
    <LinksTableDiv className={`bg-white`}>
      <tr>
        <td
          className={`flex-none px-6 py-4 whitespace-no-wrap border-b border-gray-200`}
        >
          <div className={`flex items-center`}>
            <div className={`flex-shrink-0 h-10 w-10`}>
              <img
                className={`h-10 w-10 rounded-full`}
                src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                alt={``}
              />
            </div>
            <div className={`ml-4`}>
              <div className={`text-sm leading-5 font-medium text-gray-900`}>
                {props.val.url}
              </div>
              <div className={`text-sm leading-5 text-gray-500`}>
                <a
                  href={`${props.val.url}`}
                  target={`_blank`}
                  title={`${props.val.url}`}
                  className={`text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
                >
                  Visit Link
                </a>
              </div>
            </div>
          </div>
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          <svg
            fill={`currentColor`}
            viewBox={`0 0 24 24`}
            className={`inline-block ml-2 h-5 w-5 text-green-400`}
          >
            <path
              d={`M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z`}
              clipRule={`evenodd`}
              fillRule={`evenodd`}
            ></path>
          </svg>
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          {props.val.num_links}
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          {props.val.num_ok_links}
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          {props.val.num_non_ok_links}
        </td>
        <td
          className={`flex-grow px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium`}
        >
          {/* <Link href="/site/[id]" as={`/site/${props.site.id}`}>
            <a
              className={`text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
            >
              View Stats
            </a>
          </Link> */}
          <Link href="#">
            <a
              disabled={`disabled`}
              className={`text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150 color-gray-300 opacity-50 cursor-not-allowed`}
            >
              View Detail
            </a>
          </Link>
        </td>
      </tr>
    </LinksTableDiv>
  )
}

export default LinksTable

LinksTable.propTypes = {}
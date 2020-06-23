import Link from 'next/link'
import styled from 'styled-components'
import Moment from 'react-moment'

const LinksTableDiv = styled.tbody``

const LinksTable = props => {
  const calendarStrings = {
    lastDay : '[Yesterday], dddd',
    sameDay : '[Today], dddd',
    lastWeek : 'MMMM DD, YYYY',
    sameElse : 'MMMM DD, YYYY'
  }
  
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
                {props.site.name}
              </div>
              <div className={`text-sm leading-5 text-gray-500`}>
                <a
                  href={`${props.site.url}`}
                  target={`_blank`}
                  title={`${props.site.url}`}
                  className={`text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
                >
                  Visit Link
                </a>
              </div>
            </div>
          </div>
        </td>
        <td className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200`}>
          <div className={`text-sm leading-5 text-gray-900`}>
            <Moment local calendar={calendarStrings} date={props.site.updated_at} />
          </div>
          <div className={`text-sm leading-5 text-gray-500`}>
            <Moment local date={props.site.updated_at} format="hh:mm:ss A" />
          </div>
        </td>
        <td className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200`}>
          {props.site.verified ? (
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}
            >
              Verified
            </span>
          ) : (
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800`}
            >
              Unverified
            </span>
          )}
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          50
        </td>
        <td
          className={`flex-grow px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium`}
        >
          <Link href="/site/[id]" as={`/site/${props.site.id}`}>
            <a
              className={`text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
            >
              View Stats
            </a>
          </Link>
        </td>
      </tr>
    </LinksTableDiv>
  )
}

export default LinksTable

LinksTable.propTypes = {}
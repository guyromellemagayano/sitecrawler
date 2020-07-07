import Link from 'next/link'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import useSWR from 'swr'

const fetcher = async (url) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken'),
    },
  })

  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  return data
}

const PaginationDiv = styled.nav``

const Pagination = props => {
  const { query } = useRouter()
  const pageNumbers = []
  const linksPerPage = 1
  const currentPage = parseInt(props.page) || 1;

  const { data: page, error: pageError } = useSWR(props.apiEndpoint, fetcher)

  if (pageError) return <div>{pageError.message}</div>
  if (!page) return <div>Loading...</div>

  const totalPages = Math.ceil(page.count / linksPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <PaginationDiv className={`bg-white px-4 pb-4 flex items-center justify-between border-t border-gray-200 sm:px-6 align-middle shadow sm:rounded-lg`}>
      <div className={`w-0 flex-1 flex`}>
        {currentPage !== 1 && (
          <Link href={props.pathName + `?page=${parseInt(props.page) - 1}`}>
            <a className={`-mt-px border-transparent pt-4 pr-1 inline-flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150`}>
              <svg className={`mr-3 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor`}>
                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
              Previous
            </a>
          </Link>
        )}
      </div>
      <div className={`hidden md:flex`}>
        {pageNumbers.map((val, key) => {
          return (
            <Link key={key} href={props.pathName + '?page=' + val}>
              <a className={`${currentPage === val ? "-mt-px border-indigo-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm leading-5 font-medium text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700 transition ease-in-out duration-150" : "-mt-px border-transparent border-t-2 pt-4 px-4 inline-flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150"}`}>
                {val}
              </a>
            </Link>
          )
        })}
      </div>
      <div className={`w-0 flex-1 flex justify-end`}>
        {currentPage !== totalPages && (
          <Link href={props.pathName + `?page=${parseInt(props.page) + 1}`}>
            <a className={`-mt-px border-transparent pt-4 pl-1 inline-flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150`}>
              Next
              <svg className={`ml-3 h-5 w-5 text-gray-400`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </a>
          </Link>
        )}
      </div>
    </PaginationDiv>
  );
}

export default Pagination

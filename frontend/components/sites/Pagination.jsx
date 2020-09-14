import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import Skeleton from 'react-loading-skeleton';
import useSWR from 'swr'
import ReactPaginate from 'react-paginate';

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
  const pageNumbers = []
  const linksPerPage = 20
  const currentPage = parseInt(props.page) || 1

  const { data: page, error: pageError } = useSWR(props.apiEndpoint, fetcher)

  const handlePageClick = (page) => {
    if(page.selected === props.page) return false

    // console.log('[page click]', page, props.pathName, props.page)
    Router.push(props.href, `${props.pathName}page=${page.selected + 1}`)
  }

  if (pageError) return <div>{pageError.message}</div>
  if (!page) {
    return (
      <PaginationDiv className={`bg-white px-4 py-4 flex items-center justify-between sm:px-6 align-middle shadow-xs rounded-lg`}>
        <div className={`w-0 flex-1 flex`}>
          <Skeleton duration={2} width={120} />
        </div>
        <div className={`hidden md:flex`}>
          <Skeleton duration={2} width={280} />
        </div>
        <div className={`w-0 flex-1 flex justify-end`}>
          <Skeleton duration={2} width={120} />
        </div>
      </PaginationDiv>
    )
  }

  const totalPages = Math.ceil(page.count / linksPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  if (totalPages < 2)
    return null

  return (
    <PaginationDiv className={`bg-white px-4 pb-4 flex items-center justify-center sm:px-6 align-middle shadow-xs rounded-lg`}>
        <ReactPaginate
          disableInitialCallback={false}
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          initialPage={currentPage - 1}
          breakClassName={'break-me -mt-px border-transparent border-t-2 pt-4 px-4 inline-flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150'}
          pageCount={totalPages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={10}
          onPageChange={handlePageClick}
          containerClassName={'pagination md:flex'}
          pageClassName={`-mt-px border-transparent border-t-2 pt-4 px-4 inline-flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150`}
          subContainerClassName={'pages pagination '}
          activeClassName={'active -mt-px border-indigo-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm leading-5 font-medium text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700 transition ease-in-out duration-150'}
          previousClassName={`mr-3 -mt-px border-transparent pt-4 pr-1 inline-flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150`}
          nextClassName={`ml-3 -mt-px border-transparent pt-4 pl-1 inline-flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150`}
        />
    </PaginationDiv>
  );
}

export default Pagination

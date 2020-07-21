import styled from 'styled-components'

const SortingDiv = styled.div``

const Sorting = ({ direction }) => {
    return (
        <SortingDiv>
          <span
            className={`${direction == 'asc' ? "text-gray-500" : "text-gray-300"} w-4 h-4 inline-block`}
          >
            <svg
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 15l7-7 7 7"></path>
            </svg>
          </span>
          <span
            className={`${direction == 'desc' ? "text-gray-500" : "text-gray-300"} w-4 h-4 inline-block`}
          >
            <svg
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7"></path>
            </svg>
          </span>
        </SortingDiv>
    )
}

export default Sorting;
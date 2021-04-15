import styled from 'styled-components'

const SortingDiv = styled.div``

const Sorting = ({ direction, onSortHandler, slug }) => {
    return (
        <SortingDiv>
          <button onClick={(e) => onSortHandler(slug, 'asc')}>
            <span
              className={`${direction == 'asc' ? "text-gray-500" : "text-gray-300"} asc w-4 h-4 inline-block`}
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
          </button>
          <button onClick={(e) => onSortHandler(slug, 'desc')}>
            <span
              className={`${direction == 'desc' ? "text-gray-500" : "text-gray-300"} desc w-4 h-4 inline-block`}
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
          </button>
        </SortingDiv>
    )
}

export default Sorting;
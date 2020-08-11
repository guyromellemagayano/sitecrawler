import styled from 'styled-components'
import Sorting from 'components/site/Sorting'

const ImageSortingDiv = styled.div``

const ImageSorting = props => {
  return (
    <ImageSortingDiv className="flex flex-row mr-3">
      <button
        className={`inline-flex`}
        onClick={(e) => props.onSortHandler(props.slug)}
      >
        {props.slug == "image-url" ? (
          <Sorting direction={props.sortOrder.imageUrl} />
        ) : props.slug == "created-at" ? (
          <Sorting direction={props.sortOrder.createdAt} />
        ) : props.slug == "status" ? (
          <Sorting direction={props.sortOrder.status} />
        ) : props.slug == "http-code" ? (
          <Sorting direction={props.sortOrder.httpCode} />
        ) : props.slug == "occurrences" ? (
          <Sorting direction={props.sortOrder.occurrences} />
        ) : (
          ""
        )}
      </button>
    </ImageSortingDiv>
  )
}

export default ImageSorting

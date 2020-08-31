import styled from 'styled-components'
import Sorting from 'components/site/Sorting'

const ImageSortingDiv = styled.div``

const ImageSorting = props => {
  return (
    <ImageSortingDiv className="flex flex-row mr-3">
      <div className={`inline-flex`}>
        {props.slug == "image-url" ? (
          <Sorting direction={props.sortOrder.imageUrl} onSortHandler={props.onSortHandler} slug={props.slug} />
        ) : props.slug == "image-size" ? (
          <Sorting direction={props.sortOrder.imageSize} onSortHandler={props.onSortHandler} slug={props.slug} />
        ) : props.slug == "status" ? (
          <Sorting direction={props.sortOrder.status} onSortHandler={props.onSortHandler} slug={props.slug} />
        ) : props.slug == "http-code" ? (
          <Sorting direction={props.sortOrder.httpCode} onSortHandler={props.onSortHandler} slug={props.slug} />
        ) : props.slug == "occurrences" ? (
          <Sorting direction={props.sortOrder.occurrences} onSortHandler={props.onSortHandler} slug={props.slug} />
        ) : (
          ""
        )}
      </div>
    </ImageSortingDiv>
  )
}

export default ImageSorting

import fetch from 'node-fetch'

const fetcher = async(...args) => {
  try {
    const response = await fetch(...args)
    const data = await response.json()

    if (response.ok) {
      return data
    } else {
      const error = new Error(response.statusText)

      error.response = response
      error.data = data

      throw error
    }
  } catch (error) {
    if (!error.data) {
      error.data = { message: error.message }
    }

    throw error
  }
}

export default fetcher
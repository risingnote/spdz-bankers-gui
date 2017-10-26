/**
 * Utils to manage Fetch REST responses.
 */

const isJson = headers => {
  return (
    headers.has('Content-Type') &&
    headers.get('Content-Type').startsWith('application/json')
  )
}

/**
 * Extract out body into a json object if it is JSON. 
 * Unsure because errors return a JSON body with (status, message, stack (in dev)).
 * Return json and response.
 */
const parseIfJson = response => {
  if (isJson(response.headers)) {
    return response.json().then(json => {
      return {
        response: response,
        jsonData: json
      }
    })
  } else {
    return Promise.resolve({
      response: response,
      jsonData: null
    })
  }
}

export { parseIfJson }

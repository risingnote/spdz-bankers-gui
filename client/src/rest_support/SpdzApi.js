/**
 * Abstract out calls to REST API
 */
import 'whatwg-fetch'
import HttpStatus from 'http-status-codes'

const isJson = (headers) => {
  return headers.has('Content-Type') &&
          headers.get('Content-Type').startsWith('application/json')
}

/**
 * Extract out body into a json object if it is JSON. 
 * Unsure because errors return a JSON body with (status, message, stack (in dev)).
 * Return json and response.
 */
const parseIfJson = (response) => {
  if (isJson(response.headers)) {
    return response.json()
      .then( (json) => {
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

/**
 * Get the list of SPDZ proxy servers from the GUI Rest endpoint.
 */
const getProxyConfig = () => {
  return fetch('/spdzProxyConfig',
      {
        method: 'GET',
        headers: {
          'Accept-Type': 'application/json'
        },
        mode: 'same-origin'
      })
      .then(parseIfJson)
      .then( (result) => {
        if (result.response.ok) {
          return Promise.resolve(result)
        } else {
          let error = new Error(`Unable to read spdz proxy config. Status: ${result.response.status}.`)
          error.reason = result.jsonData
          return Promise.reject(error)
        }
      })
      .then((result) => {
        return Promise.resolve(result.jsonData)
      })
}

const connectProxyToEngine = (host, apiRoot, clientId) => {
  return fetch(`${host}${apiRoot}/${clientId}/connect-to-engine`,
    {
      method: 'POST',
      headers: {
        'Accept-Type': 'application/json'
      },
      mode: 'cors'
    })
    .then(parseIfJson)
    .then( (result) => {
      if (result.response.status === HttpStatus.CREATED) {
        return Promise.resolve(result)
      } else {
        let error = new Error(
          `Unable to make spdz proxy engine connection. Status: ${result.response.status}. Reason: ${result.jsonData.message}`)
        error.reason = result.jsonData
        return Promise.reject(error)
      }
    })
    .then((result) => {
      return Promise.resolve(result.response.headers.get('Location'))
    })
}

export { getProxyConfig, connectProxyToEngine }
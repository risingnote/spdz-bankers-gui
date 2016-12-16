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
          'Accept': 'application/json'
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
        'Accept': 'application/json'
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

const consumeDataFromProxy = (host, apiRoot, clientId) => {
  return fetch(`${host}${apiRoot}/${clientId}/consume-data`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/octet-stream, application/json'
      },
      mode: 'cors'
    })
    .then(parseIfJson)
    .then( (result) => {
      if (result.response.status === HttpStatus.OK) {
        return result.response.arrayBuffer()
      } else if (result.response.status === HttpStatus.NO_CONTENT) {
        let error = new Error(
          `No data is available to consume from the spdz proxy. Status: ${result.response.status}.`)
        return Promise.reject(error)
      } else {
        let error = new Error(
          `Unable to consume data from spdz proxy. Status: ${result.response.status}. Reason: ${result.jsonData.message}`)
        error.reason = result.jsonData
        return Promise.reject(error)
      }
    })
    .then((buffer) => {
      return Promise.resolve(new Uint8Array(buffer))
    })
}

/**
 * @param {host} Hostname of spdz proxy
 * @param {apiRoot} api path
 * @param {clientId} used to distinguish which client connection to used
 * @param {payload} JSON array of base64 encoded 16 byte integers
 */
const sendDataToProxy = (host, apiRoot, clientId, payload) => {
  return fetch(`${host}${apiRoot}/${clientId}/send-data`,
    {
      method: 'POST',
      body: payload,
      mode: 'cors'
    })
    .then(parseIfJson)
    .then( (result) => {
      if (result.response.status === HttpStatus.OK) {
        return Promise.resolve()
      } else {
        let error = new Error(
          `Unable to send data to spdz proxy. Status: ${result.response.status}. Reason: ${result.jsonData.message}`)
        error.reason = result.jsonData
        return Promise.reject(error)
      }
    })
}

export { getProxyConfig, connectProxyToEngine, consumeDataFromProxy, sendDataToProxy }
/**
 * Manage REST calls to GUI server`.
 */
import { parseIfJson } from './restUtils'

/**
 * Get the SPDZ proxy servers config.
 * @param {String} endpoint to get the config, typically just path 
 *                   as fetching from same location as the GUI.
 * @returns {Promise} resolve to json from server or reject with Error.
 */
const getProxyConfig = endpoint => {
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    mode: 'same-origin'
  })
    .then(parseIfJson)
    .then(result => {
      if (result.response.ok) {
        return Promise.resolve(result.jsonData)
      } else {
        let error = new Error(
          `Unable to read SPDZ proxy config from ${endpoint}. Status: ${result
            .response.status}.`
        )
        error.reason = result.jsonData
        return Promise.reject(error)
      }
    })
}


export { getProxyConfig }

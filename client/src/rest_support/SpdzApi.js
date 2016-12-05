/**
 * Abstract out calls to REST API
 */
import 'whatwg-fetch'
import CheckRestStatus from './CheckStatus'

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
      .then(CheckRestStatus)
      .then((response) => {
        return response.json()
      })
      .catch((ex) => {
        return Promise.reject(new Error('Parsing response from /spdzProxyConfig failed: ' + ex.message))
      })
}

export default getProxyConfig

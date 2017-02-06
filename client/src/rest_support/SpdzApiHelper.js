/**
 * Higher level functions to interact with the SPDZ api.
 */
import { consumeDataFromProxies, sendInputsToProxies } from './SpdzApiAggregate'
import { decrypt } from '../crypto/cryptoLib'
import sharesFromTriples from '../math/sharesFromTriples'
import Gfp from '../math/Gfp'
import extractClientId from '../math/clientIdFromBuffer'

/**
 * Retrieve shares to be used to send input to SPDZ proxies.
 * Wait for all SPDZ proxies to send shares rejecting if an error (no timeout)
 * Validate the triples, sum them
 * @param {inputNum} Number of shares required and so number of triples expected.
 * @param {encrypted} true or false to indicate expect encrypted data
 * @param {spdzProxyList} List containing url and encryptionKey for each proxy 
 * @param {spdzApiRoot} url path
 * @param {clientId} Identify client connection to proxy
 * @param {waitTimeoutMs} Optional wait timeout ms to wait for shares to be available.
 * @returns Promise resolved with list of shares (length inputNum) or reject with Error
 */
const retrieveShares = (inputNum, encrypted, spdzProxyList, spdzApiRoot, clientId, waitTimeoutMs=0) => {
  return consumeDataFromProxies(spdzProxyList.map(spdzProxy => spdzProxy.get('url')), 
                                  spdzApiRoot, clientId, waitTimeoutMs)
    .then((cipherValues) => {
      return (encrypted ? cipherValues.map( (buffer, index) => {
          const encryptionKey = spdzProxyList.get(index).get('encryptionKey')
          return decrypt(encryptionKey, buffer)
          }) : cipherValues)
    })
    .then((clearValues) => {
      try {
        return Promise.resolve(sharesFromTriples(inputNum, clearValues))
      } catch (err) {
        Promise.reject(err)
      }
    })
}

/**
 * Retrieve winner client id.
 * Wait for all SPDZ proxies to send expected same value of client public key as 32 bit buffer.
 * @param {spdzProxyList} List containing url and encryptionKey for each proxy 
 * @param {spdzApiRoot} url path
 * @param {clientId} Identify client connection to proxy
 * @returns Promise resolved with list of shares (length inputNum) or reject with Error
 */
const retrieveWinnerClientId = (spdzProxyList, spdzApiRoot, clientId) => {
  return consumeDataFromProxies(spdzProxyList.map(spdzProxy => spdzProxy.get('url')), spdzApiRoot, clientId)
    .then((values) => {
      if (spdzProxyList.size !== values.length) {
        return Promise.reject(new Error(`Expecting ${spdzProxyList.size} client ids from SPDZ, got ${values.length}.`))
      }
      try {
        return Promise.resolve(extractClientId(values))
      } catch (err) {
        return Promise.reject(err)
      }
    })
}

/**
 * Sending a list of inputs to all Spdz proxies after retrieving shares and applying to inputs.
 * @returns Promise with empty return if all OK or rejects with error
 */
const sendInputsWithShares = ( (inputList, encrypted, spdzProxyList, spdzApiRoot, clientId, waitTimeoutMs=0) => {
  return retrieveShares(inputList.length, encrypted, spdzProxyList, spdzApiRoot, clientId, waitTimeoutMs )
      .then( (shareList) => {
        return inputList.map( (input, i) => {
          return shareList[i].add(Gfp.fromString(input).toMontgomery())  
        })
      })
      .then( (inputList) => {
        return sendInputsToProxies(spdzProxyList.map(spdzProxy => spdzProxy.get('url')),
                 spdzApiRoot, clientId, inputList)
      })
})

export { retrieveShares, retrieveWinnerClientId, sendInputsWithShares }

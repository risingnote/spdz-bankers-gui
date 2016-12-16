/**
 * Higher level functions to interact with the SPDZ api.
 */
import { consumeDataFromProxies, sendInputsToProxies } from './SpdzApiAggregate'
import { decrypt } from '../crypto/cryptoLib'
import sharesFromTriples from '../math/sharesFromTriples'
import Gfp from '../math/Gfp'

/**
 * Retrieve shares to be used to send input to SPDZ proxies.
 * Wait for all SPDZ proxies to send shares rejecting if an error (no timeout)
 * Validate the triples, sum them
 * @param {inputNum} Number of shares required and so number of triples expected.
 * @param {encrypted} true or false to indicate expect encrypted data
 * @param {spdzProxyList} List containing url and encryptionKey for each proxy 
 * @param {spdzApiRoot} url path
 * @param {clientId} Identify client connection to proxy
 * @returns Promise resolved with list of shares (length inputNum) or reject with Error
 */
const retrieveShares = (inputNum, encrypted, spdzProxyList, spdzApiRoot, clientId) => {
  return consumeDataFromProxies(spdzProxyList.map(spdzProxy => spdzProxy.get('url')), spdzApiRoot, clientId)
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
 * Sending a list of inputs to all Spdz proxies after retrieving shares and applying to inputs.
 * @returns Promise with empty return if all OK or rejects with error
 */
const sendInputsWithShares = ( (inputList, encrypted, spdzProxyList, spdzApiRoot, clientId) => {
  return retrieveShares(inputList.length, encrypted, spdzProxyList, spdzApiRoot, clientId )
      .then( (shareList) => {
        return inputList.map( (input, i) => {
          return shareList[i].add(Gfp.fromString(input).toMontgomery())  
        })
      })
      .then( (inputList) => {
        return sendInputsToProxies(inputList)
      })
})

const pollForResult = ( () => {
  // How handle long poll ?
  // See https://davidwalsh.name/javascript-polling for polling with promises, i.e. wait for data.
  // Think about api like readShares, writeIntegers, readIntegers with params (encrypt (true/false), count) )
})

export { retrieveShares, sendInputsWithShares, pollForResult }

/**
 * Higher level functioins to interact with the SPDZ api.
 * 
 * How handle long poll ?
 * See https://davidwalsh.name/javascript-polling for polling with promises, i.e. wait for data.
 * Think about api like readShares, writeIntegers, readIntegers with params (encrypt (true/false), count) )
 * 
 */
import { connectProxyToEngine, consumeDataFromProxy } from './SpdzApi'
import ProxyStatusCodes from '../setup/ProxyStatusCodes'
import { decrypt } from '../crypto/cryptoLib'
import sharesFromTriples from '../math/sharesFromTriples'
import Gfp from '../math/Gfp'

/**
 * Run connection setup on all spdz proxy servers for this client.
 * No throws or rejects expected.
 *  
 * @param {spdzProxyUrlList} List of urls, one per SPDZ proxy
 * @returns Promise which is thenable once all connection setup requests are finished.
 *          Returns a list of objects with id (position in url list) and status. 
 */
const connectToSpdzProxies = (spdzProxyUrlList, spdzApiRoot, clientId) => {
  
  const connectList = spdzProxyUrlList.map( (url, index) => {
    return connectProxyToEngine(url, spdzApiRoot, clientId) 
      .then((connectLocation) => {
        return {id: index, status: ProxyStatusCodes.Connected}
      }, (ex) => {
        console.log('Unable to successfully run connection setup.', (ex.reason ? ex.reason.message : ex.message))
        return {id: index, status: ProxyStatusCodes.Failure}        
      })
  })

  return Promise.all(connectList)
}

/**
 * Consume binary data from all spdz proxy servers. A low level function which should be wrapped
 * for specific expected data.
 *  
 * @param {spdzProxyUrlList} List of urls, one per SPDZ proxy
 * @returns Promise which is thenable once each latest server transmission has been consumed.
 *          Returns a list of Uint8Array buffers in same order as spdzProxyUrlList.
 *          Errors not handled here. 
 */
const consumeDataFromSpdzProxies = (spdzProxyUrlList, spdzApiRoot, clientId) => {
  
  const consumeList = spdzProxyUrlList.map( (url, index) => {
    return consumeDataFromProxy(url, spdzApiRoot, clientId) 
  })

  return Promise.all(consumeList)
}

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
  return consumeDataFromSpdzProxies(spdzProxyList.map(spdzProxy => spdzProxy.get('url')), spdzApiRoot, clientId)
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
 * Send same inputs (masked with summed shares) to each SPDZ proxy 
 */
const sendInputs = ( (inputList ) => {
  
})

/**
 * Sending a list of inputs to all Spdz proxies after retrieving shares and applying to inputs.
 */
const sendInputsWithShares = ( (inputList, encrypted, spdzProxyList, spdzApiRoot, clientId) => {
  return retrieveShares(inputList.length, true, this.props.spdzProxyServerList, 
                    this.props.spdzApiRoot, this.props.clientPublicKey )
      .then( (shareList) => {
        return inputList.map( (input, i) => {
          return shareList[i].add(Gfp.fromString(input).toMontgomery())  
        })
      })
      .then( (inputList) => {
        return sendInputs(inputList)
      })
})

export { connectToSpdzProxies, consumeDataFromSpdzProxies, retrieveShares, sendInputsWithShares }

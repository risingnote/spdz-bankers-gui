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

const consumeTriplesForShares = (tripleNum, encrypted, spdzProxyList, spdzApiRoot, clientId) => {
  return consumeDataFromSpdzProxies(spdzProxyList.map(spdzProxy => spdzProxy.get('url')), spdzApiRoot, clientId)
    .then((values) => {
      let decryptValues = values
      if (encrypted) {
        decryptValues = values.map( (buffer, index) => {
          const encryptionKey = spdzProxyList.get(index).get('encryptionKey')
          return decrypt(encryptionKey, buffer)
        })
      }
      return decryptValues
    })
}

export { connectToSpdzProxies, consumeDataFromSpdzProxies, consumeTriplesForShares }

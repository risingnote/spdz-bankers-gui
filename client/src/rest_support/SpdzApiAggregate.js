/**
 * Aggregated SPDZ REST API functions to communicate with all SPDZ proxies.
 */
import { connectProxyToEngine, checkEngineConnection, consumeDataFromProxy, sendDataToProxy } from './SpdzApi'
import ProxyStatusCodes from '../setup/ProxyStatusCodes'
import { base64Encode } from '../math/binary'

/**
 * Run connection setup on all spdz proxy servers for this client.
 * No throws or rejects expected.
 *  
 * @param {spdzProxyUrlList} List of urls, one per SPDZ proxy
 * @returns Promise which is thenable once all connection setup requests are finished.
 *          Returns a list of objects with id (position in url list) and status. 
 */
const connectToProxies = (spdzProxyUrlList, spdzApiRoot, clientId) => {

  const connectList = spdzProxyUrlList.map( (url, index) => {
    return connectProxyToEngine(url, spdzApiRoot, clientId) 
      .then(() => {
        return {id: index, status: ProxyStatusCodes.Connected}
      }, (ex) => {
        console.log('Unable to successfully run connection setup.', (ex.reason ? ex.reason.message : ex.message))
        return {id: index, status: ProxyStatusCodes.Failure}        
      })
  })

  return Promise.all(connectList)
}

/**
 * Run check on connections for all spdz proxy servers for this client.
 * No throws or rejects expected.
 *  
 * @param {spdzProxyUrlList} List of urls, one per SPDZ proxy
 * @returns Promise which is thenable once all status checks are finished.
 *          Returns a list of objects with id (position in url list) and status. 
 */
const checkProxies = (spdzProxyUrlList, spdzApiRoot, clientId) => {

  const checkList = spdzProxyUrlList.map( (url, index) => {
    return checkEngineConnection(url, spdzApiRoot, clientId) 
      .then(() => {
        return {id: index, status: ProxyStatusCodes.Connected}
      }, (ex) => {
        return {id: index, status: ProxyStatusCodes.Failure}        
      })
  })

  return Promise.all(checkList)
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
const consumeDataFromProxies = (spdzProxyUrlList, spdzApiRoot, clientId) => {
  
  const consumeList = spdzProxyUrlList.map( (url, index) => {
    return consumeDataFromProxy(url, spdzApiRoot, clientId) 
  })

  return Promise.all(consumeList)
}

/**
 * Manage sending 1 or more inputs to each SPDZ proxy 
 * @param {spdzProxyUrlList} List of urls, one per SPDZ proxy
 * @param {inputList} List of Gfp types, typically montgomery format with shares added in.
 * @returns Promise with empty return if all OK or rejects with error   
 */
const sendInputsToProxies = ( (spdzProxyUrlList, spdzApiRoot, clientId, inputList) => {
  const payload = inputList.map( gfpInput => base64Encode(gfpInput))

  const sendInputsList = spdzProxyUrlList.map( (url, index) => {
    return sendDataToProxy(url, spdzApiRoot, clientId, JSON.stringify(payload)) 
  })

  return Promise.all(sendInputsList)  
})

export { connectToProxies, checkProxies, consumeDataFromProxies, sendInputsToProxies }

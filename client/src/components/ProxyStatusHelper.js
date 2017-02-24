/**
 * Utility functions to support the display of spdz proxy config state in Connection component.
 */
import { List, Map } from 'immutable'
import { ProxyStatusCodes } from 'spdz-gui-lib' 

const findOrDefault = (statusValues, index) => {
    const match = statusValues.find(element => element.id  === index)
    return match !== undefined ? match.status : ProxyStatusCodes.Disconnected
}

/**
 * Generate the proxy connection status list to be used by the Connection component.
 * @param {spdzProxyList} Immutable List of Map containing key for 'url', represents proxy servers
 * @param {values} Array of {id, ProxyStatus} to apply to spdzProxyList, map be empty list or < spdzProxyList
 * @returns An immutable List<Map> containing url:String and status:ProxyStatusCode.
 */
const generateProxyStatusList = (spdzProxyList, statusValues) => {

  return List(
     spdzProxyList.map( (spdzProxy, index) => {
      return Map( {
        url: spdzProxy.get('url'),
        status: findOrDefault(statusValues, index)
      })
    })
  )
}    
 
export { generateProxyStatusList }

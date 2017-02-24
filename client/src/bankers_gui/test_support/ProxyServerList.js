/**
 * Examples of spdzProxyList usually read at startup from config
 * and spdzConnectionStatus usually derived after connecting or disconnecting.
 */
import { List, Map } from 'immutable'
import { ProxyStatusCodes } from 'spdz-gui-lib' 

const noProxiesSpdzConfig = List()

const twoProxiesSpdzConfig = List.of(
      Map({
        url: "http://spdzProxy.one:4000",
        publicKey: "0102030405060708010203040506070801020304050607080102030405060708", 
        encryptionKey: "AA02030405060708010203040506070801020304050607080102030405060708"
      }),
      Map({
        url: "http://spdzProxy.two:4000",
        publicKey: "3302030405060708010203040506070801020304050607080102030405060708",         
        encryptionKey: "BB02030405060708010203040506070801020304050607080102030405060708"
      })
    )

const twoProxiesWith0Connected = List.of(
      Map({
        url: "http://spdzProxy.one:4000",
        status: ProxyStatusCodes.Disconnected
      }),
      Map({
        url: "http://spdzProxy.two:4000",
        status: ProxyStatusCodes.Disconnected
      })
    )

const twoProxiesWith1Connected = List.of(
      Map({
        url: "http://spdzProxy.one:4000",
        status: ProxyStatusCodes.Failure
      }),
      Map({
        url: "http://spdzProxy.two:4000",
        status: ProxyStatusCodes.Connected
      })
    )

const twoProxiesWith2Connected = List.of(
      Map({
        url: "http://spdzProxy.one:4000",
        status: ProxyStatusCodes.Connected
      }),
      Map({
        url: "http://spdzProxy.two:4000",
        status: ProxyStatusCodes.Connected
      })
    )

export { noProxiesSpdzConfig, twoProxiesSpdzConfig, twoProxiesWith0Connected, twoProxiesWith1Connected, twoProxiesWith2Connected }
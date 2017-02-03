/**
 * Examples of spdzProxyList state maintained in SetupContainer, used for testing.
 */
import { List, Map } from 'immutable'
import ProxyStatusCodes from '../rest_support/ProxyStatusCodes'

const noProxies = List()

const twoProxiesWith0Connected = List.of(
      Map({
        url: "http://spdzProxy.one:4000",
        publicKey: "0102030405060708010203040506070801020304050607080102030405060708", 
        status: ProxyStatusCodes.Disconnected,
        encryptionKey: "AA02030405060708010203040506070801020304050607080102030405060708"
      }),
      Map({
        url: "http://spdzProxy.two:4000",
        status: ProxyStatusCodes.Disconnected,
        publicKey: "3302030405060708010203040506070801020304050607080102030405060708",         
        encryptionKey: "BB02030405060708010203040506070801020304050607080102030405060708"
      })
    )

const twoProxiesWith1Connected = List.of(
      Map({
        url: "http://spdzProxy.one:4000",
        publicKey: "0102030405060708010203040506070801020304050607080102030405060708", 
        status: ProxyStatusCodes.Disconnected,
        encryptionKey: "AA02030405060708010203040506070801020304050607080102030405060708"
      }),
      Map({
        url: "http://spdzProxy.two:4000",
        status: ProxyStatusCodes.Connected,
        publicKey: "3302030405060708010203040506070801020304050607080102030405060708",         
        encryptionKey: "BB02030405060708010203040506070801020304050607080102030405060708"
      })
    )

const twoProxiesWith2Connected = List.of(
      Map({
        url: "http://spdzProxy.one:4000",
        publicKey: "0102030405060708010203040506070801020304050607080102030405060708", 
        status: ProxyStatusCodes.Connected,
        encryptionKey: "AA02030405060708010203040506070801020304050607080102030405060708"
      }),
      Map({
        url: "http://spdzProxy.two:4000",
        status: ProxyStatusCodes.Connected,
        publicKey: "3302030405060708010203040506070801020304050607080102030405060708",         
        encryptionKey: "BB02030405060708010203040506070801020304050607080102030405060708"
      })
    )

export { noProxies, twoProxiesWith0Connected, twoProxiesWith1Connected, twoProxiesWith2Connected }
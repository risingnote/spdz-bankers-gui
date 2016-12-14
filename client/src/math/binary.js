import BigInt from 'big-integer'
// Care on this import as it must override builtin Node Buffer global for testing.
// TODO look for alternative base64 from hex encoding - to avoid using nodes Buffer 
import {Buffer} from 'buffer/'

/**
 * Convert a typed array (Uint8Array) populated from the spdz proxy (little endian) into a big integer
 */
const fromSpdzBinary = (spdzBinary) => {
  if (!(spdzBinary instanceof Buffer)) {
    throw new Error('fromSpdzBinary expects a Buffer type.')
  }

  const bufAsHexString = spdzBinary.reverse().toString('hex')
  return BigInt(bufAsHexString, 16)
}

/**
 * Convert a big integer into a base64 encoded string, representing a big endian integer.
 */
const base64Encode = (bigIntValue) => {
  if (!(bigIntValue instanceof BigInt)) {
    throw new Error('base64Encode expects a BigInt type.')
  }
  let hexValue = bigIntValue.toString(16)
  if (hexValue.length % 2 !== 0) {
    hexValue = '0' + hexValue
  }

  const buf = Buffer.from(hexValue, 'hex')
  return buf.toString('base64')
}

export { fromSpdzBinary, base64Encode }

import BigInt from 'big-integer'
import Base64 from 'base-64'

const toHex = (num) => {
  if (num < 16) return '0' + num.toString(16)
  return num.toString(16)
}

/**
 * Convert a typed array (Uint8Array) populated from the spdz proxy (litte endian) into a big integer
 */
export const fromSpdzBinary = (spdzBinary) => {
  if (!(spdzBinary instanceof Uint8Array)) {
    throw new Error('fromSpdzBinary expects a Uint8Array type.')
  }

  const bufAsHexString = spdzBinary.reduceRight((prev, curr, index, array) => {
    return prev + toHex(curr)
  }, '')

  return BigInt(bufAsHexString, 16)
}

/**
 * Convert a big integer into a base64 encoded string, representing a big endian integer.
 */
export const base64Encode = (bigIntValue) => {
  if (!(bigIntValue instanceof BigInt)) {
    throw new Error('base64Encode expects a BigInt type.')
  }
  let hexValue = bigIntValue.toString(16)
  if (hexValue.length % 2 !== 0) {
    hexValue = '0' + hexValue
  }
  //const buf = Buffer.from(hexValue, 'hex')
  //console.log(buf.toString())

  //use STring.fromCharCode(num, num ?), or can map typed array onto a byte sequence ?

  return Base64.encode(hexValue)
}

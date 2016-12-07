/**
 * Utility functions to move between native and montgomery format in field gfp.
 */
import BigInt from 'big-integer'

/**
 * Hard code prime for gfp, montgomery conversion primatives.
 * Assumption that spdz is using a 128 bit field.
 */
const prime = BigInt('172035116406933162231178957667602464769')
const r = BigInt(2).pow(128)
const rInverse = r.modInv(prime)

/**
 * Convert from a native representation to a montgomery representation
 * @param bigIntNative Big integer holding native representation
 * @returns bigInt in montgomery format
 */
const toMontgomery = (bigIntNative) => {
  if (!(bigIntNative instanceof BigInt)) {
    throw new Error('Conversion toMontgomery requires a big integer type.')
  }
  return bigIntNative.multiply(r).mod(prime)
}

/**
 * Convert from a montgomery representation to a native representation
 * @param bigInt holding montgomery representation
 * @returns bigInt holding native representation
 */
const fromMontgomery = (bigIntMontgomery) => {
  if (!(bigIntMontgomery instanceof BigInt)) {
    throw new Error('Conversion fromMontgomery requires a big integer type.')
  }
  return BigInt(bigIntMontgomery).multiply(rInverse).mod(prime)
}

export { toMontgomery, fromMontgomery }
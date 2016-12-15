/**
 * Represent a big integer in a finite field (mod P). May be in montgomery format or in native format.
 */
import BigInt from 'big-integer'

/**
 * Hard code prime for gfp, montgomery conversion primatives.
 * Assumption that spdz is using a 128 bit field.
 */
const INTEGER_LENGTH_BYTES = 16
const GFP_PRIME = BigInt('172035116406933162231178957667602464769')
const r = BigInt(2).pow(INTEGER_LENGTH_BYTES * 8)
const rInverse = r.modInv(GFP_PRIME)

class Gfp {
  constructor (bigint, montg=false) {
    if (!(bigint instanceof BigInt)) {
       throw new Error(`Gfp type must wrap a BigInt type.`)
    }
    this.val = bigint.mod(GFP_PRIME)
    if (!this.val.equals(bigint)) {
      throw new Error(`Got an integer ${bigint.toString()} which exceeds the field size.`)
    } 
    this.montg = montg
  }

  /**
   * return true if montgomery format
   */
  isMontgomery() {
    return this.montg
  }
  add(other) {
    if (!(other instanceof Gfp)) {
       throw new Error(`Add requires a Gfp type.`)
    }
    if (this.montg !== other.montg) {
      throw new Error(`Add requires both types to be native format or montgomery format.`)
    }
    return new Gfp(this.val.add(other.val).mod(GFP_PRIME), this.montg)
  }
  multiply(other) {
    if (!(other instanceof Gfp)) {
       throw new Error(`Mult requires a Gfp type.`)
    }
    if (this.montg !== other.montg) {
      throw new Error(`Mult requires both types to be native format or montgomery format.`)
    }
    if (this.montg) {
      return new Gfp(this.val.multiply(other.val).multiply(rInverse).mod(GFP_PRIME), this.montg)
    } else {
      return new Gfp(this.val.multiply(other.val).mod(GFP_PRIME), this.montg)
    }
  }
  
  /**
   * Convert from a native representation to a montgomery representation
   * @returns new Gfp in montgomery format
   */
  toMontgomery() {
    if (this.montg) {
      throw new Error('Attempting to convert existing montgormery format toMontgomery.')
    }
    return new Gfp(this.val.multiply(r).mod(GFP_PRIME), true)
  }
  
  /**
   * Convert from a montgomery representation to a native representation
   * @returns new Gfp in native representation
   */
  fromMontgomery() {
    if (!this.montg) {
      throw new Error('Attempting to convert existing native format fromMontgomery.')
    }
    return new Gfp(this.val.multiply(rInverse).mod(GFP_PRIME), false)
  }

  toString() {
    return this.val.toString() + (this.montg ? ' Montgomery' : ' not Montgomery')
  }

  equals(other) {
    if (!(other instanceof Gfp)) {
      return false
    }
    return this.val.equals(other.val) && this.montg === other.montg
  }

  static integerLengthBytes() {
    return INTEGER_LENGTH_BYTES
  }
}  

export default Gfp

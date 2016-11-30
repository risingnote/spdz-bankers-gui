import BigInt from 'big-integer'
import {toMontgomery, fromMontgomery} from './montgomery'

describe('Convert integers between native and montgomery format', () => {
  it('converts native to montgomery and back', () => {
    const nativeVal = BigInt('123456789')
    expect(fromMontgomery(toMontgomery(nativeVal))).toEqual(nativeVal)
  })

  it('converts a known montgomery number', () => {
    expect(fromMontgomery(BigInt('50197844390672583818590000880091070221'))).toEqual(BigInt('123'))
  })

  it('throws an error if a biginteger is not passed in', () => {
    const testThrowsTo = () => toMontgomery('501978443')
    const testThrowsFrom = () => fromMontgomery('501978443')

    expect(testThrowsTo).toThrowError('Conversion toMontgomery requires a big integer type.')
    expect(testThrowsFrom).toThrowError('Conversion fromMontgomery requires a big integer type.')
  })
})

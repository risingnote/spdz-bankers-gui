import BigInt from 'big-integer'
import Gfp from './Gfp'

describe('Map integers into Gfp finite field and convert between native and montgomery format', () => {
  it('converts native to montgomery and back', () => {
    const nativeGfp = new Gfp(BigInt('123456789'))

    const montgGfp = nativeGfp.toMontgomery()
    expect(montgGfp.isMontgomery()).toBeTruthy()

    const nativeGfpAgain = montgGfp.fromMontgomery()
    expect(nativeGfpAgain.isMontgomery()).toBeFalsy()

    expect(nativeGfpAgain).toEqual(nativeGfp)
  })

  it('converts a known montgomery number', () => {
    const montGfp = new Gfp(BigInt('50197844390672583818590000880091070221'), true)
    expect(montGfp.fromMontgomery()).toEqual(new Gfp(BigInt('123')))
  })

  it('adds 2 native numbers', () => {
    const a = new Gfp(BigInt('12'))
    const b = new Gfp(BigInt('16'))
    const c = new Gfp(BigInt('28'))

    expect(a.add(b)).toEqual(c)
  })

  it('adds 2 montgomery numbers', () => {
    const a = new Gfp((BigInt('12'))).toMontgomery()
    const b = new Gfp((BigInt('16'))).toMontgomery()
    const c = new Gfp((BigInt('28'))).toMontgomery()

    expect(a.add(b)).toEqual(c)
  })
  
  it('multiplies 2 native numbers', () => {
    const a = new Gfp(BigInt('12'))
    const b = new Gfp(BigInt('16'))
    const c = new Gfp(BigInt('192'))

    expect(a.multiply(b)).toEqual(c)
  })

  it('multiplies 2 montgomery numbers', () => {
    const a = new Gfp((BigInt('12'))).toMontgomery()
    const b = new Gfp((BigInt('16'))).toMontgomery()
    const c = new Gfp((BigInt('192'))).toMontgomery()

    expect(a.multiply(b)).toEqual(c)
  })

  it('checks for equality correctly', () => {
    expect( (new Gfp(BigInt('12345'))).equals(new Gfp(BigInt('12345'))) ).toBeTruthy()
    expect( (new Gfp(BigInt('99'), true)).equals(new Gfp(BigInt('99'), true)) ).toBeTruthy()
    expect( (new Gfp(BigInt('123'))).equals(new Gfp(BigInt('456'))) ).toBeFalsy()
    expect( (new Gfp(BigInt('99'), false)).equals(new Gfp(BigInt('99'), true)) ).toBeFalsy()    
    expect( (new Gfp(BigInt('99'), false)).equals('why am I here') ).toBeFalsy()
  })
})

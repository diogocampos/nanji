import Ruby, { r, R } from './ruby'

describe('r', () => {
  it('returns a Ruby with a single atom', () => {
    const ruby = r('foo', 'bar')

    expect(ruby['_atoms']).toEqual([{ base: 'foo', text: 'bar' }])
  })
})

describe('R', () => {
  it('with no arguments, returns an empty Ruby', () => {
    const ruby = R()

    expect(ruby['_atoms']).toEqual([])
  })

  it('merges a sequence of Rubies into a single Ruby', () => {
    const ruby = R(
      r('ab', '1'),
      R(),
      R(r('cd', '2'), r('ef', '3')),
      r('gh', '4'),
    )

    expect(ruby['_atoms']).toEqual([
      { base: 'ab', text: '1' },
      { base: 'cd', text: '2' },
      { base: 'ef', text: '3' },
      { base: 'gh', text: '4' },
    ])
  })
})

describe('Ruby', () => {
  describe('#length', () => {
    it('returns the number of atoms in the Ruby', () => {
      const length = 1 + Math.floor(Math.random() * 10)
      const rubies = Array<Ruby>(length).fill(r('foo', 'bar'))

      const ruby = R(...rubies)

      expect(ruby.length).toEqual(length)
    })

    it('returns 0 if the Ruby is empty', () => {
      const ruby = R()

      expect(ruby.length).toEqual(0)
    })
  })

  describe('#map', () => {
    it('returns array of results of applying a function to each atom', () => {
      const ruby = R(r('ab', '1'), r('cd', '2'), r('ef', '3'))

      const results = ruby.map((atom, index) => `${index}:${atom.base}`)

      expect(results).toEqual(['0:ab', '1:cd', '2:ef'])
    })

    it('returns an empty array if the Ruby is empty', () => {
      const ruby = R()

      const results = ruby.map(() => 42)

      expect(results).toEqual([])
    })
  })

  describe('#toString', () => {
    it('builds a string by joining the base of each atom', () => {
      const ruby = R(r('ab', '1'), r('', '2'), r('cd', '3'))

      expect(ruby.toString()).toEqual('abcd')
    })

    it('returns an empty string if the Ruby is empty', () => {
      const ruby = R()

      expect(ruby.toString()).toEqual('')
    })
  })
})

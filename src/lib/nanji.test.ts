import nanji from './nanji'
import { R, r } from './ruby'
import { randomString } from './test-helpers'

const { spyOn } = jest

afterEach(() => {
  jest.restoreAllMocks()
})

describe('getNewPhrase', () => {
  describe('with no arguments', () => {
    it('calls buildPhrase once with the current time', () => {
      const phrase = r(randomString(), randomString())

      spyOn(nanji, 'buildPhrase').mockReturnValue(phrase)

      const now = new Date()
      const result = nanji.getNewPhrase()

      expect(nanji.buildPhrase).toHaveBeenCalledTimes(1)
      expect(nanji.buildPhrase).toHaveBeenCalledWith(
        now.getHours(),
        now.getMinutes(),
      )

      expect(result).toEqual(R(phrase))
    })
  })

  describe('with a previous Ruby', () => {
    it('calls buildPhrase once if first result is different', () => {
      const previousPhrase = r(randomString(), randomString())
      const newPhrase = r(randomString(), randomString())

      spyOn(nanji, 'buildPhrase').mockReturnValue(newPhrase)

      const result = nanji.getNewPhrase(previousPhrase)

      expect(nanji.buildPhrase).toHaveBeenCalledTimes(1)
      expect(result).toEqual(newPhrase)
    })

    it('calls buildPhrase repeatedly if result is the same', () => {
      const previousPhrase = r(randomString(), randomString())
      const newPhrase = r(randomString(), randomString())

      spyOn(nanji, 'buildPhrase')
        .mockReturnValueOnce(previousPhrase)
        .mockReturnValueOnce(previousPhrase)
        .mockReturnValue(newPhrase)

      const result = nanji.getNewPhrase(previousPhrase)

      expect(nanji.buildPhrase).toHaveBeenCalledTimes(3)
      expect(result).toEqual(newPhrase)
    })
  })
})

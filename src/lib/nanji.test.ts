import nanji from './nanji'
import * as random from './random'
import { R, r } from './ruby'

const { spyOn } = jest

describe('getNewPhrase', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('with no arguments', () => {
    it('calls buildPhrase once with the current time', () => {
      const phrase = r(random.string(), random.string())

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
      const previousPhrase = r(random.string(), random.string())
      const newPhrase = r(random.string(), random.string())

      spyOn(nanji, 'buildPhrase').mockReturnValue(newPhrase)

      const result = nanji.getNewPhrase(previousPhrase)

      expect(nanji.buildPhrase).toHaveBeenCalledTimes(1)
      expect(result).toEqual(newPhrase)
    })

    it('calls buildPhrase repeatedly if result is the same', () => {
      const previousPhrase = r(random.string(), random.string())
      const newPhrase = r(random.string(), random.string())

      spyOn(nanji, 'buildPhrase')
        .mockReturnValueOnce(previousPhrase)
        .mockReturnValueOnce(previousPhrase)
        .mockReturnValue(newPhrase)

      const result = nanji.getNewPhrase(previousPhrase)

      expect(nanji.buildPhrase).toHaveBeenCalledTimes(3)
      expect(result).toEqual(R(newPhrase))
    })
  })

  describe('with a specific time', () => {
    it('calls buildPhrase with the given time', () => {
      const phrase = r(random.string(), random.string())
      const time = { hour: random.hour(), minute: random.minute() }

      spyOn(nanji, 'buildPhrase').mockReturnValue(phrase)

      const result = nanji.getNewPhrase(R(), time)

      expect(nanji.buildPhrase).toHaveBeenCalledTimes(1)
      expect(nanji.buildPhrase).toHaveBeenCalledWith(time.hour, time.minute)
      expect(result).toEqual(R(phrase))
    })
  })
})

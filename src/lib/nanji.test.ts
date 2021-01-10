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

describe('buildPhrase', () => {
  let getArgs: () => Parameters<typeof nanji.buildPhrase>
  let match: any

  const ITERATIONS_PER_TEST = 100

  afterEach(() => {
    for (let i = 0; i < ITERATIONS_PER_TEST; ++i) {
      const ruby = nanji.buildPhrase(...getArgs())
      expect(ruby.toString()).toEqual(match)
    }
  })

  describe('options.imawa', () => {
    it('adds IMAWA if true', () => {
      getArgs = () => [...random.time(), { imawa: true }]
      match = expect.stringMatching(/^今は/)
    })

    it("doesn't add IMAWA if false", () => {
      getArgs = () => [...random.time(), { imawa: false }]
      match = expect.not.stringMatching(/今は/)
    })
  })

  describe('options.choudo', () => {
    it("adds CHOUDO before time if set to 'before' and minute is 0 or 30", () => {
      getArgs = () => [
        random.hour(),
        random.pick(0, 30),
        { choudo: 'before', ampm: false },
      ]
      match = expect.stringMatching(/ちょうど.*(時|正午)/)
    })

    it("adds CHOUDO after time if set to 'after' and minute is 0 or 30", () => {
      getArgs = () => [
        random.hour(),
        random.pick(0, 30),
        { choudo: 'after', ampm: false },
      ]
      match = expect.stringMatching(/(時|正午).*ちょうど/)
    })

    it('adds CHOUDO after time if set and options.ampm = true', () => {
      getArgs = () => [
        random.hour(),
        random.pick(0, 30),
        { choudo: random.pick('before', 'after'), ampm: true },
      ]
      match = expect.stringMatching(/時.*ちょうど/)
    })

    it("doesn't add CHOUDO if minute is not 0 or 30", () => {
      getArgs = () => [
        random.hour(),
        random.pick(random.int(1, 29), random.int(31, 59)),
        { choudo: random.pick('before', 'after') },
      ]
      match = expect.not.stringMatching(/ちょうど/)
    })

    it("doesn't add CHOUDO if set to false", () => {
      getArgs = () => [random.hour(), random.pick(0, 30), { choudo: false }]
      match = expect.not.stringMatching(/ちょうど/)
    })
  })

  describe('options.goro', () => {
    it('adds GORO and rounds the time if true and minute is near 0', () => {
      getArgs = () => [
        random.hour(),
        random.pick(random.int(56, 59), random.int(1, 4)),
        { goro: true },
      ]
      match = expect.stringMatching(/[^分]+ごろ/)
    })

    it('adds GORO and rounds the time if true and minute is near 30', () => {
      getArgs = () => [
        random.hour(),
        random.pick(random.int(26, 29), random.int(31, 34)),
        { goro: true },
      ]
      match = expect.stringMatching(/半ごろ/)
    })

    it("doesn't add GORO if true but minute is exactly 0 or 30", () => {
      getArgs = () => [random.hour(), random.pick(0, 30), { goro: true }]
      match = expect.not.stringMatching(/ごろ/)
    })

    it("doesn't add GORO if true but minute is not near 0 or 30", () => {
      getArgs = () => [
        random.hour(),
        random.pick(random.int(5, 25), random.int(35, 55)),
        { goro: true },
      ]
      match = expect.not.stringMatching(/ごろ/)
    })

    it("doesn't add GORO if false", () => {
      getArgs = () => [...random.time(), { goro: false }]
      match = expect.not.stringMatching(/ごろ/)
    })
  })

  describe('options.ampm', () => {
    it('adds GOZEN if true and time < 12:00 with options.goro = false', () => {
      getArgs = () => [
        random.int(0, 11),
        random.minute(),
        { ampm: true, goro: false },
      ]
      match = expect.stringMatching(/午前/)
    })

    it('adds GOZEN if true and time < 12:00 with options.goro = true', () => {
      getArgs = () => [
        ...random.pick<[number, number]>(
          [random.int(0, 10), random.minute()],
          [11, random.int(0, 55)],
          [23, random.int(56, 59)],
        ),
        { ampm: true, goro: true },
      ]
      match = expect.stringMatching(/午前/)
    })

    it('add GOGO if true and time >= 12:00 with options.goro = false', () => {
      getArgs = () => [
        random.int(12, 23),
        random.minute(),
        { ampm: true, goro: false },
      ]
      match = expect.stringMatching(/午後/)
    })

    it('adds GOGO if true and time >= 12:00 with options.goro = true', () => {
      getArgs = () => [
        ...random.pick<[number, number]>(
          [11, random.int(56, 59)],
          [random.int(12, 22), random.minute()],
          [23, random.int(0, 55)],
        ),
        { ampm: true, goro: true },
      ]
      match = expect.stringMatching(/午後/)
    })

    it("doesn't add GOZEN or GOGO if false", () => {
      getArgs = () => [...random.time(), { ampm: false }]
      match = expect.not.stringMatching(/午前|午後/)
    })
  })

  describe('REIJI', () => {
    it('is used if time is 0:00', () => {
      getArgs = () => [0, 0]
      match = expect.stringMatching(/零時/)
    })

    it('is used if time is 12:00 with options.ampm = true', () => {
      getArgs = () => [12, 0, { ampm: true }]
      match = expect.stringMatching(/零時/)
    })

    it('is used if time is near 0:00 with options.goro = true', () => {
      getArgs = () => [
        ...random.pick<[number, number]>(
          [0, random.int(1, 4)],
          [23, random.int(56, 59)],
        ),
        { goro: true },
      ]
      match = expect.stringMatching(/零時/)
    })

    it('is used if time is near 12:00 with options.goro and options.ampm', () => {
      getArgs = () => [
        ...random.pick<[number, number]>(
          [11, random.int(56, 59)],
          [12, random.int(1, 4)],
        ),
        { goro: true, ampm: true },
      ]
      match = expect.stringMatching(/零時/)
    })

    it("isn't used if time is 12:00 but options.ampm = false", () => {
      getArgs = () => [12, 0, { ampm: false }]
      match = expect.not.stringMatching(/零時/)
    })

    it("isn't used if time is near 12:00 with options.goro but !options.ampm", () => {
      getArgs = () => [
        ...random.pick<[number, number]>(
          [11, random.int(55, 59)],
          [12, random.int(1, 4)],
        ),
        { goro: true, ampm: false },
      ]
      match = expect.not.stringMatching(/零時/)
    })

    it("isn't used if time is not 0:00 or 12:00 with options.goro = false", () => {
      getArgs = () => [
        ...random.pick<[number, number]>(
          [0, random.int(1, 59)],
          [random.int(1, 11), random.minute()],
          [12, random.int(1, 59)],
          [random.int(13, 23), random.minute()],
        ),
        { goro: false },
      ]
      match = expect.not.stringMatching(/零時/)
    })

    it("isn't used if time is not near 0:00 or 12:00", () => {
      getArgs = () => [
        ...random.pick<[number, number]>(
          [0, random.int(5, 59)],
          [random.int(1, 10), random.minute()],
          [11, random.int(0, 55)],
          [12, random.int(5, 59)],
          [random.int(13, 22), random.minute()],
          [23, random.int(0, 55)],
        ),
      ]
      match = expect.not.stringMatching(/零時/)
    })
  })

  describe('options.shougo', () => {
    it('uses SHOUGO if true and time is 12:00 with options.ampm = false', () => {
      getArgs = () => [12, 0, { shougo: true, ampm: false }]
      match = expect.stringMatching(/正午/)
    })

    it('uses SHOUGO if true and near 12:00 with options.goro and !options.ampm', () => {
      getArgs = () => [
        ...random.pick<[number, number]>(
          [11, random.int(56, 59)],
          [12, random.int(1, 4)],
        ),
        { shougo: true, goro: true, ampm: false },
      ]
      match = expect.stringMatching(/正午/)
    })

    it("doesn't use SHOUGO if options.ampm = true", () => {
      getArgs = () => [
        ...random.pick<[number, number]>([12, 0], random.time()),
        { ampm: true },
      ]
      match = expect.not.stringMatching(/正午/)
    })

    it("doesn't use SHOUGO if true but time is not near 12:00", () => {
      getArgs = () => [
        ...random.pick<[number, number]>(
          [random.int(0, 10), random.minute()],
          [11, random.int(0, 55)],
          [12, random.int(5, 59)],
          [random.int(13, 23), random.minute()],
        ),
        { shougo: true },
      ]
      match = expect.not.stringMatching(/正午/)
    })

    it("doesn't use SHOUGO if true and near 12:00 but options.goro = false", () => {
      getArgs = () => [
        ...random.pick<[number, number]>(
          [11, random.int(56, 59)],
          [12, random.int(1, 4)],
        ),
        { shougo: true, goro: false },
      ]
      match = expect.not.stringMatching(/正午/)
    })

    it("doesn't use SHOUGO if false", () => {
      getArgs = () => [
        ...random.pick<[number, number]>([12, 0], random.time()),
        { shougo: false },
      ]
      match = expect.not.stringMatching(/正午/)
    })
  })

  describe('options.han', () => {
    it('uses HAN if true and minute is 30', () => {
      getArgs = () => [random.hour(), 30, { han: true }]
      match = expect.stringMatching(/半/)
    })

    it('uses HAN if options.goro = true and minute is near 30, even if false', () => {
      getArgs = () => [
        random.hour(),
        random.pick(random.int(26, 29), random.int(31, 34)),
        { goro: true },
      ]
      match = expect.stringMatching(/半/)
    })

    it("doesn't use HAN if true but minute is not 30 or near 30", () => {
      getArgs = () => [
        random.hour(),
        random.pick(random.int(0, 25), random.int(35, 59)),
        { han: true },
      ]
      match = expect.not.stringMatching(/半/)
    })

    it("doesn't use HAN if true and near :30 but options.goro = false", () => {
      getArgs = () => [
        random.hour(),
        random.pick(random.int(26, 29), random.int(31, 34)),
        { han: true, goro: false },
      ]
      match = expect.not.stringMatching(/半/)
    })

    it("desn't use HAN if false and options.goro = false", () => {
      getArgs = () => [...random.time(), { han: false, goro: false }]
      match = expect.not.stringMatching(/半/)
    })

    it("doesn't use HAN if false and minute is 30 or not near 30", () => {
      getArgs = () => [
        random.hour(),
        random.pick(random.int(0, 25), 30, random.int(35, 59)),
        { han: false },
      ]
      match = expect.not.stringMatching(/半/)
    })
  })

  describe('options.desu', () => {
    it('adds DESU if true', () => {
      getArgs = () => [...random.time(), { desu: true }]
      match = expect.stringMatching(/です。$/)
    })

    it('adds DESU if false but options.imawa = true', () => {
      getArgs = () => [...random.time(), { desu: false, imawa: true }]
      match = expect.stringMatching(/です。$/)
    })

    it("doesn't add DESU if false with options.imawa = false", () => {
      getArgs = () => [...random.time(), { desu: false, imawa: false }]
      match = expect.not.stringMatching(/です/)
    })
  })
})

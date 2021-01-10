import { storageItem } from './helpers'
import * as random from './random'

describe('storageItem', () => {
  describe('the resulting load function', () => {
    it('calls storage.getItem and returns the result', () => {
      const key = random.string()
      const value = random.string()

      const mockStorage = ({
        getItem: jest.fn().mockReturnValue(value),
      } as unknown) as Storage

      const [load] = storageItem(key, mockStorage)
      const result = load()

      expect(mockStorage.getItem).toHaveBeenCalledWith(key)
      expect(result).toEqual(value)
    })
  })

  describe('the resulting save function', () => {
    it('calls storage.setItem when given a string', () => {
      const key = random.string()
      const value = random.string()

      const mockStorage = ({
        setItem: jest.fn(),
      } as unknown) as Storage

      const [, save] = storageItem(key, mockStorage)
      save(value)

      expect(mockStorage.setItem).toHaveBeenCalledWith(key, value)
    })

    it('calls storage.removeItem when given null', () => {
      const key = random.string()

      const mockStorage = ({
        removeItem: jest.fn(),
        setItem: jest.fn(),
      } as unknown) as Storage

      const [, save] = storageItem(key, mockStorage)
      save(null)

      expect(mockStorage.removeItem).toHaveBeenCalledWith(key)
      expect(mockStorage.setItem).not.toHaveBeenCalled()
    })
  })
})

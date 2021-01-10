export const hour = (): number => int(0, 23)
export const minute = (): number => int(0, 59)
export const time = (): [number, number] => [hour(), minute()]

export function int(min: number, max: number): number {
  return min + Math.floor(Math.random() * (1 + max - min))
}

export function pick<T>(first: T, second: T, ...rest: T[]): T {
  const items = [first, second].concat(rest)
  const index = int(0, items.length - 1)
  return items[index]
}

export function string(): string {
  return Math.random().toString(36).slice(2)
}
